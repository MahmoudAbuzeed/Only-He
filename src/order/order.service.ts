import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";

import { Order, OrderStatus, PaymentStatus } from "./entities/order.entity";
import { OrderItem, OrderItemType } from "./entities/order-item.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CartService } from "../cart/cart.service";
import { ProductService } from "../product/product.service";
import { ErrorHandler } from "shared/errorHandler.service";
import { CREATED_SUCCESSFULLY } from "messages";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly errorHandler: ErrorHandler
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    try {
      // Get user's active cart
      const cartResponse = await this.cartService.getCart(userId);
      const cart = cartResponse.data; // Extract cart data from response
      if (!cart.items || cart.items.length === 0) {
        throw this.errorHandler.badRequest({ message: "Cart is empty" });
      }

      // Validate stock availability for all items
      for (const cartItem of cart.items) {
        if (cartItem.product) {
          const hasStock = await this.productService.checkStock(
            cartItem.product.id,
            cartItem.quantity
          );
          if (!hasStock) {
            throw this.errorHandler.badRequest({
              message: `Insufficient stock for product: ${cartItem.product.name}`,
            });
          }
        }
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order
      const order = this.orderRepository.create({
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        subtotal: cart.subtotal,
        tax_amount: cart.tax_amount || 0,
        shipping_amount: cart.shipping_amount || 0,
        discount_amount: cart.discount_amount || 0,
        total_amount: cart.total,
        coupon_code: createOrderDto.coupon_code || (cart as any).coupon_code,
        applied_offers: (cart as any).applied_offers || [],
        shipping_address: createOrderDto.shipping_address,
        billing_address:
          createOrderDto.billing_address || createOrderDto.shipping_address,
        shipping_method: createOrderDto.shipping_method,
        notes: createOrderDto.notes,
      });

      const savedOrder = await this.orderRepository.save(order);

      // Create order items
      for (const cartItem of cart.items) {
        const orderItem = this.orderItemRepository.create({
          order_id: savedOrder.id,
          item_type: cartItem.item_type as OrderItemType,
          product_id: cartItem.product_id,
          package_id: cartItem.package_id,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          total_price: cartItem.total_price,
          item_name:
            cartItem.product?.name || cartItem.package?.name || "Unknown Item",
          item_sku: cartItem.product?.sku || cartItem.package?.sku,
          item_details: {
            description:
              cartItem.product?.description || cartItem.package?.description,
            image_url:
              cartItem.product?.images?.[0] || cartItem.package?.image_url,
            attributes: cartItem.product?.attributes,
          },
          product_options: cartItem.product_options,
          applied_discounts: cartItem.applied_discounts,
        });

        await this.orderItemRepository.save(orderItem);

        // Reserve stock for products
        if (cartItem.product) {
          await this.productService.reserveStock(
            cartItem.product.id,
            cartItem.quantity
          );
        }
      }

      // Clear the cart after successful order creation
      await this.cartService.clearCart(userId);

      return {
        message: CREATED_SUCCESSFULLY,
        data: {
          order_id: savedOrder.id,
          order_number: savedOrder.order_number,
          total_amount: savedOrder.total_amount,
        },
      };
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrdersByUser(userId: number) {
    try {
      const orders = await this.orderRepository.find({
        where: { user_id: userId },
        relations: ["items", "items.product", "items.package"],
        order: { created_at: "DESC" },
      });

      return orders;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrderById(userId: number, orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId, user_id: userId },
        relations: ["items", "items.product", "items.package", "payments"],
      });

      if (!order) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }

      return order;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
      const result = await this.orderRepository.update(orderId, { status });
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }
      return { message: "Order status updated successfully" };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.orderRepository.count();
    const orderNumber = `ORD-${year}-${String(count + 1).padStart(6, "0")}`;
    return orderNumber;
  }

  // Methods for admin user statistics
  async countByUser(userId: number): Promise<number> {
    try {
      return await this.orderRepository.count({ where: { user_id: userId } });
    } catch (error) {
      return 0;
    }
  }

  async getTotalSpentByUser(userId: number): Promise<number> {
    try {
      const result = await this.orderRepository.sum("total_amount", {
        user_id: userId,
        status: Not(OrderStatus.CANCELLED),
      });

      return result || 0;
    } catch (error) {
      return 0;
    }
  }

  async getLastOrderDate(userId: number): Promise<Date | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { user_id: userId },
        order: { created_at: "DESC" },
        select: ["created_at"],
      });

      return order ? order.created_at : null;
    } catch (error) {
      return null;
    }
  }
}
