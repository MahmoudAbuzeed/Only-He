import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../../order/entities/order.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { ProductService } from '../../product/product.service';
import { ErrorHandler } from 'shared/errorHandler.service';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@Injectable()
export class AdminOrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly productService: ProductService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async getAllOrders(filters: any) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        user_id,
        date_from,
        date_to,
        min_amount,
        max_amount,
      } = filters;

      const skip = (page - 1) * limit;

      let queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.items', 'items')
        .select([
          'order.id',
          'order.order_number',
          'order.status',
          'order.payment_status',
          'order.total_amount',
          'order.user_id',
          'order.guest_phone',
          'order.phone_validated_at',
          'order.created_at',
          'order.updated_at',
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.email',
          'items.id',
        ]);

      // Apply filters
      if (status) {
        queryBuilder = queryBuilder.andWhere('order.status = :status', { status });
      }

      if (user_id) {
        queryBuilder = queryBuilder.andWhere('order.user_id = :userId', { userId: user_id });
      }

      if (date_from && date_to) {
        queryBuilder = queryBuilder.andWhere('order.created_at BETWEEN :dateFrom AND :dateTo', {
          dateFrom: new Date(date_from),
          dateTo: new Date(date_to),
        });
      }

      if (min_amount) {
        queryBuilder = queryBuilder.andWhere('order.total_amount >= :minAmount', { minAmount: min_amount });
      }

      if (max_amount) {
        queryBuilder = queryBuilder.andWhere('order.total_amount <= :maxAmount', { maxAmount: max_amount });
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination and get results
      const orders = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('order.created_at', 'DESC')
        .getMany();

      // Add items count and is_guest to each order
      const ordersWithItemCount = orders.map(order => ({
        ...order,
        is_guest: order.user_id == null,
        items_count: order.items?.length || 0,
        items: undefined, // Remove items array to keep response clean
      }));

      // Get summary statistics
      const summaryQuery = this.orderRepository.createQueryBuilder('order');
      
      const [totalOrders, totalRevenue, pendingOrders, processingOrders] = await Promise.all([
        summaryQuery.getCount(),
        summaryQuery.select('SUM(order.total_amount)', 'total').getRawOne().then(result => parseFloat(result.total) || 0),
        summaryQuery.where('order.status = :status', { status: OrderStatus.PENDING }).getCount(),
        summaryQuery.where('order.status = :status', { status: OrderStatus.PROCESSING }).getCount(),
      ]);

      return {
        orders: ordersWithItemCount,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        summary: {
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          pending_orders: pendingOrders,
          processing_orders: processingOrders,
        },
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrderAnalytics(period: string = 'month') {
    try {
      const now = new Date();
      let startDate: Date;

      // Calculate start date based on period
      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Get basic analytics
      const [totalOrders, totalRevenue, orders] = await Promise.all([
        this.orderRepository.count({ where: { created_at: Between(startDate, now) } }),
        this.orderRepository
          .createQueryBuilder('order')
          .select('SUM(order.total_amount)', 'total')
          .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate: now })
          .getRawOne()
          .then(result => parseFloat(result.total) || 0),
        this.orderRepository.find({
          where: { created_at: Between(startDate, now) },
          relations: ['items', 'items.product'],
        }),
      ]);

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Orders by status
      const ordersByStatus = await this.orderRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate: now })
        .groupBy('order.status')
        .getRawMany();

      const orderStatusMap = ordersByStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {});

      // Revenue by day (for the period)
      const revenueByDay = await this.orderRepository
        .createQueryBuilder('order')
        .select('DATE(order.created_at)', 'date')
        .addSelect('SUM(order.total_amount)', 'revenue')
        .addSelect('COUNT(*)', 'orders')
        .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate: now })
        .groupBy('DATE(order.created_at)')
        .orderBy('DATE(order.created_at)', 'ASC')
        .getRawMany();

      // Top products
      const topProducts = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoin('orderItem.order', 'order')
        .leftJoin('orderItem.product', 'product')
        .select('product.id', 'product_id')
        .addSelect('product.name', 'name')
        .addSelect('SUM(orderItem.quantity)', 'quantity_sold')
        .addSelect('SUM(orderItem.total_price)', 'revenue')
        .where('order.created_at BETWEEN :startDate AND :endDate', { startDate, endDate: now })
        .groupBy('product.id, product.name')
        .orderBy('SUM(orderItem.total_price)', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        orders_by_status: orderStatusMap,
        revenue_by_day: revenueByDay.map(item => ({
          date: item.date,
          revenue: parseFloat(item.revenue),
          orders: parseInt(item.orders),
        })),
        top_products: topProducts.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity_sold: parseInt(item.quantity_sold),
          revenue: parseFloat(item.revenue),
        })),
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrderById(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'items', 'items.product', 'items.package', 'payments'],
      });

      if (!order) {
        throw this.errorHandler.notFound({ message: 'Order not found' });
      }

      return {
        ...order,
        is_guest: order.user_id == null,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async validatePhone(id: number, sendSms = false): Promise<{ message: string; phone_validated_at: string }> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw this.errorHandler.notFound({ message: 'Order not found' });
      }
      const phoneValidatedAt = new Date();
      await this.orderRepository.update(id, {
        phone_validated_at: phoneValidatedAt,
        updated_at: phoneValidatedAt,
      });
      if (sendSms && (order.guest_phone || order.shipping_address?.phone)) {
        const phone = order.guest_phone || order.shipping_address?.phone;
        // Placeholder: integrate with SNS/Twilio when available
        console.log(`[SMS] Would send confirmation to ${phone} for order ${order.order_number}`);
      }
      return {
        message: 'Phone validated successfully',
        phone_validated_at: phoneValidatedAt.toISOString(),
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async sendConfirmationSms(id: number): Promise<{ message: string }> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw this.errorHandler.notFound({ message: 'Order not found' });
      }
      const phone = order.guest_phone || order.shipping_address?.phone;
      if (!phone) {
        throw this.errorHandler.badRequest({
          message: 'No phone number on order to send SMS',
        });
      }
      // Placeholder: integrate with SNS/Twilio when available
      console.log(`[SMS] Send confirmation to ${phone} for order ${order.order_number}`);
      return {
        message: `Confirmation SMS queued for ${phone}`,
      };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw this.errorHandler.notFound({ message: 'Order not found' });
      }

      const updateData: any = {
        status: updateOrderStatusDto.status,
        updated_at: new Date(),
      };

      if (updateOrderStatusDto.tracking_number) {
        updateData.tracking_number = updateOrderStatusDto.tracking_number;
      }

      if (updateOrderStatusDto.admin_notes) {
        updateData.admin_notes = updateOrderStatusDto.admin_notes;
      }

      // Set shipped_at or delivered_at timestamps
      if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
        updateData.shipped_at = new Date();
      } else if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
        updateData.delivered_at = new Date();
      }
      if (updateOrderStatusDto.status === OrderStatus.CONFIRMED) {
        updateData.confirmed_at = new Date();
      }

      await this.orderRepository.update(id, updateData);

      // TODO: Send notification to customer if notify_customer is true
      if (updateOrderStatusDto.notify_customer) {
        // Implement email notification logic here
        console.log(`Notification sent to customer for order ${order.order_number}`);
      }

      return {
        message: 'Order status updated successfully',
        order_number: order.order_number,
        new_status: updateOrderStatusDto.status,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async cancelOrder(id: number, reason: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw this.errorHandler.notFound({ message: 'Order not found' });
      }

      if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot cancel order with status: ${order.status}` 
        });
      }

      // Restore inventory for products
      for (const item of order.items) {
        if (item.product) {
          await this.productService.releaseStock(item.product.id, item.quantity);
        }
      }

      // Update order status
      await this.orderRepository.update(id, {
        status: OrderStatus.CANCELLED,
        admin_notes: `Cancelled: ${reason}`,
        updated_at: new Date(),
      });

      return {
        message: 'Order cancelled successfully',
        order_number: order.order_number,
        refund_amount: order.total_amount,
      };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getUserOrders(userId: number, filters: any) {
    try {
      const { page = 1, limit = 20 } = filters;
      const skip = (page - 1) * limit;

      const [orders, total] = await this.orderRepository.findAndCount({
        where: { user_id: userId },
        relations: ['items', 'items.product'],
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      return {
        orders,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async exportOrdersCSV(filters: any) {
    try {
      // This is a simplified implementation
      // In a real application, you'd use a CSV library like 'csv-writer'
      
      const orders = await this.orderRepository.find({
        relations: ['user', 'items'],
        order: { created_at: 'DESC' },
      });

      // Generate CSV content
      const headers = 'Order Number,Customer Name,Email,Status,Total Amount,Created Date\n';
      const rows = orders.map(order => 
        `${order.order_number},${order.user.first_name} ${order.user.last_name},${order.user.email},${order.status},${order.total_amount},${order.created_at}`
      ).join('\n');

      const csvContent = headers + rows;

      return {
        content: csvContent,
        filename: `orders_export_${new Date().toISOString().split('T')[0]}.csv`,
        contentType: 'text/csv',
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }
}
