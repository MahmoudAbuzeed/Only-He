import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminOrderService } from '../services/admin-order.service';
import { AdminGuard } from '../guards/admin.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { OrderStatus } from '../../order/entities/order.entity';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@ApiTags('Admin - Order Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard, PermissionsGuard)
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @Get()
  @RequirePermissions({ resource: 'orders', action: 'read' })
  @ApiOperation({ 
    summary: 'Get all orders (Admin)',
    description: 'Retrieve all orders with filtering, pagination, and detailed information'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status', enum: OrderStatus })
  @ApiQuery({ name: 'user_id', required: false, description: 'Filter by user ID', example: 1 })
  @ApiQuery({ name: 'date_from', required: false, description: 'Filter from date (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({ name: 'date_to', required: false, description: 'Filter to date (YYYY-MM-DD)', example: '2024-12-31' })
  @ApiQuery({ name: 'min_amount', required: false, description: 'Minimum order amount', example: 100 })
  @ApiQuery({ name: 'max_amount', required: false, description: 'Maximum order amount', example: 1000 })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
    example: {
      orders: [
        {
          id: 1,
          order_number: 'ORD-2024-000001',
          user: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com'
          },
          status: 'pending',
          payment_status: 'pending',
          total_amount: 999.99,
          items_count: 2,
          created_at: '2024-01-15T10:30:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      summary: {
        total_orders: 150,
        total_revenue: 45000.00,
        pending_orders: 12,
        processing_orders: 8
      }
    }
  })
  getAllOrders(@Query() filters: any) {
    return this.adminOrderService.getAllOrders(filters);
  }

  @Get('analytics')
  @RequirePermissions({ resource: 'analytics', action: 'view_reports' })
  @ApiOperation({ 
    summary: 'Get order analytics',
    description: 'Retrieve order statistics and analytics data'
  })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (day, week, month, year)', example: 'month' })
  @ApiResponse({ 
    status: 200, 
    description: 'Order analytics retrieved',
    example: {
      total_orders: 150,
      total_revenue: 45000.00,
      average_order_value: 300.00,
      orders_by_status: {
        pending: 12,
        confirmed: 8,
        processing: 15,
        shipped: 20,
        delivered: 85,
        cancelled: 10
      },
      revenue_by_day: [
        { date: '2024-01-01', revenue: 1500.00, orders: 5 },
        { date: '2024-01-02', revenue: 2200.00, orders: 7 }
      ],
      top_products: [
        { product_id: 1, name: 'iPhone 15 Pro', quantity_sold: 25, revenue: 24975.00 }
      ]
    }
  })
  getOrderAnalytics(@Query('period') period?: string) {
    return this.adminOrderService.getOrderAnalytics(period);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'orders', action: 'read' })
  @ApiOperation({ 
    summary: 'Get order details (Admin)',
    description: 'Retrieve detailed order information including items, payments, and tracking'
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Order details retrieved',
    example: {
      id: 1,
      order_number: 'ORD-2024-000001',
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      status: 'processing',
      payment_status: 'paid',
      items: [
        {
          id: 1,
          product: { id: 1, name: 'iPhone 15 Pro', sku: 'IPH15PRO' },
          quantity: 1,
          unit_price: 999.99,
          total_price: 999.99
        }
      ],
      subtotal: 999.99,
      tax_amount: 80.00,
      shipping_amount: 15.00,
      total_amount: 1094.99,
      shipping_address: {
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA'
      },
      payments: [
        {
          id: 1,
          amount: 1094.99,
          status: 'completed',
          payment_method: 'cash_on_delivery',
          processed_at: '2024-01-15T11:00:00Z'
        }
      ],
      tracking_number: 'TRK123456789',
      created_at: '2024-01-15T10:30:00Z'
    }
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.adminOrderService.getOrderById(id);
  }

  @Patch(':id/status')
  @RequirePermissions({ resource: 'orders', action: 'update' })
  @ApiOperation({ 
    summary: 'Update order status',
    description: 'Update order status and add tracking information'
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: 1 })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Order status updated successfully',
    example: { 
      message: 'Order status updated successfully',
      order_number: 'ORD-2024-000001',
      new_status: 'shipped'
    }
  })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.adminOrderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/cancel')
  @RequirePermissions({ resource: 'orders', action: 'cancel' })
  @ApiOperation({ 
    summary: 'Cancel order',
    description: 'Cancel an order and restore inventory'
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: 1 })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        reason: { type: 'string', example: 'Customer requested cancellation' } 
      } 
    } 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order cancelled successfully',
    example: { 
      message: 'Order cancelled successfully',
      order_number: 'ORD-2024-000001',
      refund_amount: 1094.99
    }
  })
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
  ) {
    return this.adminOrderService.cancelOrder(id, reason);
  }

  @Get('user/:userId')
  @RequirePermissions({ resource: 'orders', action: 'read' })
  @ApiOperation({ 
    summary: 'Get user orders (Admin)',
    description: 'Retrieve all orders for a specific user'
  })
  @ApiParam({ name: 'userId', description: 'User ID', example: 1 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiResponse({ 
    status: 200, 
    description: 'User orders retrieved successfully'
  })
  getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() filters: any,
  ) {
    return this.adminOrderService.getUserOrders(userId, filters);
  }

  @Get('export/csv')
  @RequirePermissions({ resource: 'analytics', action: 'export_data' })
  @ApiOperation({ 
    summary: 'Export orders to CSV',
    description: 'Export order data to CSV format with filtering options'
  })
  @ApiQuery({ name: 'date_from', required: false, description: 'Export from date' })
  @ApiQuery({ name: 'date_to', required: false, description: 'Export to date' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ 
    status: 200, 
    description: 'CSV export generated',
    content: {
      'text/csv': {
        schema: { type: 'string', format: 'binary' }
      }
    }
  })
  exportOrdersCSV(@Query() filters: any) {
    return this.adminOrderService.exportOrdersCSV(filters);
  }
}
