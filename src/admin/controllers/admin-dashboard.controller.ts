import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { AdminGuard } from '../guards/admin.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard, PermissionsGuard)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('overview')
  @RequirePermissions({ resource: 'analytics', action: 'view_dashboard' })
  @ApiOperation({ 
    summary: 'Get dashboard overview',
    description: 'Retrieve key metrics and statistics for admin dashboard'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard overview retrieved successfully',
    example: {
      summary: {
        total_users: 1250,
        total_orders: 3420,
        total_products: 156,
        total_revenue: 125000.50,
        new_users_today: 12,
        orders_today: 45,
        revenue_today: 2340.00,
        low_stock_count: 5
      },
      orders_by_status: {
        pending: 10,
        confirmed: 5,
        processing: 3,
        shipped: 2,
        delivered: 100,
        cancelled: 0,
        refunded: 0
      },
      recent_orders: [
        {
          id: 1,
          order_number: 'ORD-2024-000001',
          customer_name: 'John Doe',
          total_amount: 999.99,
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z'
        }
      ],
      low_stock_products: [
        {
          id: 1,
          name_en: 'iPhone 15 Pro',
          name_ar: 'آيفون 15 برو',
          sku: 'IPH15PRO',
          stock_quantity: 3,
          min_stock_level: 10
        }
      ],
      top_selling_products: [
        {
          product_id: 1,
          name: 'iPhone 15 Pro',
          quantity_sold: 45,
          revenue: 44999.55
        }
      ]
    }
  })
  getDashboardOverview() {
    return this.adminDashboardService.getDashboardOverview();
  }

  @Get('sales-analytics')
  @RequirePermissions({ resource: 'analytics', action: 'view_reports' })
  @ApiOperation({ 
    summary: 'Get sales analytics',
    description: 'Retrieve detailed sales analytics and trends'
  })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (7d, 30d, 90d, 1y)', example: '30d' })
  @ApiQuery({ name: 'group_by', required: false, description: 'Group by (day, week, month)', example: 'day' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sales analytics retrieved successfully',
    example: {
      period: '30d',
      total_revenue: 45000.00,
      total_orders: 150,
      average_order_value: 300.00,
      growth_rate: 15.5,
      sales_by_period: [
        { period: '2024-01-01', revenue: 1500.00, orders: 5 },
        { period: '2024-01-02', revenue: 2200.00, orders: 7 }
      ],
      top_categories: [
        { category: 'Electronics', revenue: 25000.00, percentage: 55.6 },
        { category: 'Clothing', revenue: 15000.00, percentage: 33.3 }
      ],
      payment_methods: [
        { method: 'cash_on_delivery', count: 120, percentage: 80.0 },
        { method: 'credit_card', count: 30, percentage: 20.0 }
      ]
    }
  })
  getSalesAnalytics(
    @Query('period') period?: string,
    @Query('group_by') groupBy?: string,
  ) {
    return this.adminDashboardService.getSalesAnalytics(period, groupBy);
  }

  @Get('user-analytics')
  @RequirePermissions({ resource: 'analytics', action: 'view_reports' })
  @ApiOperation({ 
    summary: 'Get user analytics',
    description: 'Retrieve user registration and activity analytics'
  })
  @ApiQuery({ name: 'period', required: false, description: 'Time period', example: '30d' })
  @ApiResponse({ 
    status: 200, 
    description: 'User analytics retrieved successfully',
    example: {
      total_users: 1250,
      new_users_period: 85,
      active_users_period: 420,
      user_growth_rate: 7.3,
      registrations_by_period: [
        { period: '2024-01-01', count: 12 },
        { period: '2024-01-02', count: 8 }
      ],
      user_activity: {
        daily_active_users: 156,
        weekly_active_users: 340,
        monthly_active_users: 890
      },
      top_customers: [
        {
          user_id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          total_orders: 15,
          total_spent: 4500.00
        }
      ]
    }
  })
  getUserAnalytics(@Query('period') period?: string) {
    return this.adminDashboardService.getUserAnalytics(period);
  }

  @Get('inventory-status')
  @RequirePermissions({ resource: 'products', action: 'read' })
  @ApiOperation({ 
    summary: 'Get inventory status',
    description: 'Retrieve inventory levels and stock alerts'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inventory status retrieved successfully',
    example: {
      total_products: 156,
      low_stock_count: 12,
      out_of_stock_count: 3,
      total_inventory_value: 125000.00,
      low_stock_products: [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          sku: 'IPH15PRO',
          stock_quantity: 3,
          min_stock_level: 10,
          category: 'Electronics'
        }
      ],
      out_of_stock_products: [
        {
          id: 2,
          name: 'Samsung Galaxy S24',
          sku: 'SGS24',
          stock_quantity: 0,
          category: 'Electronics'
        }
      ],
      top_selling_products: [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          quantity_sold: 45,
          revenue: 44999.55,
          stock_remaining: 15
        }
      ]
    }
  })
  getInventoryStatus() {
    return this.adminDashboardService.getInventoryStatus();
  }

  @Get('recent-activities')
  @RequirePermissions({ resource: 'analytics', action: 'view_dashboard' })
  @ApiOperation({ 
    summary: 'Get recent activities',
    description: 'Retrieve recent system activities and events'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of activities to return', example: 20 })
  @ApiResponse({ 
    status: 200, 
    description: 'Recent activities retrieved successfully',
    example: {
      activities: [
        {
          id: 1,
          type: 'order_created',
          description: 'New order ORD-2024-000001 created by John Doe',
          user: { id: 1, name: 'John Doe' },
          metadata: { order_id: 1, amount: 999.99 },
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'product_updated',
          description: 'Product iPhone 15 Pro stock updated',
          admin: { id: 2, name: 'Admin User' },
          metadata: { product_id: 1, old_stock: 20, new_stock: 15 },
          created_at: '2024-01-15T10:25:00Z'
        }
      ]
    }
  })
  getRecentActivities(@Query('limit') limit?: number) {
    return this.adminDashboardService.getRecentActivities(limit);
  }

  @Get('system-health')
  @RequirePermissions({ resource: 'analytics', action: 'view_dashboard' })
  @ApiOperation({ 
    summary: 'Get system health status',
    description: 'Retrieve system performance and health metrics'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'System health status retrieved successfully',
    example: {
      status: 'healthy',
      uptime: '15 days, 4 hours, 23 minutes',
      database: {
        status: 'connected',
        response_time: '2ms',
        connections: 15
      },
      api: {
        status: 'operational',
        response_time: '45ms',
        requests_per_minute: 120
      },
      storage: {
        used: '2.5GB',
        available: '47.5GB',
        usage_percentage: 5.0
      },
      recent_errors: [
        {
          message: 'Product not found',
          count: 3,
          last_occurrence: '2024-01-15T09:15:00Z'
        }
      ]
    }
  })
  getSystemHealth() {
    return this.adminDashboardService.getSystemHealth();
  }
}
