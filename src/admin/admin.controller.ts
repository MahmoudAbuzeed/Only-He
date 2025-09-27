import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Admin - General')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  @ApiOperation({ 
    summary: 'Get admin profile',
    description: 'Retrieve current admin user profile with roles and permissions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin profile retrieved successfully',
    example: {
      id: 1,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      roles: [
        {
          id: 1,
          name: 'Super Admin',
          type: 'admin',
          permissions: {
            users: { create: true, read: true, update: true, delete: true },
            products: { create: true, read: true, update: true, delete: true },
            orders: { read: true, update: true, cancel: true, refund: true }
          }
        }
      ],
      last_login: '2024-01-15T10:30:00Z'
    }
  })
  getAdminProfile(@Request() req) {
    return this.adminService.getAdminProfile(req.user.id);
  }

  @Get('permissions')
  @ApiOperation({ 
    summary: 'Get admin permissions',
    description: 'Retrieve all available permissions and current admin permissions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Permissions retrieved successfully',
    example: {
      available_permissions: {
        users: ['create', 'read', 'update', 'delete', 'assign_roles'],
        products: ['create', 'read', 'update', 'delete', 'manage_stock'],
        categories: ['create', 'read', 'update', 'delete'],
        orders: ['read', 'update', 'cancel', 'refund', 'track'],
        analytics: ['view_dashboard', 'view_reports', 'export_data']
      },
      user_permissions: {
        users: { create: true, read: true, update: true, delete: true },
        products: { create: true, read: true, update: true, delete: true },
        orders: { read: true, update: true, cancel: true, refund: true }
      }
    }
  })
  getAdminPermissions(@Request() req) {
    return this.adminService.getAdminPermissions(req.user.id);
  }

  @Get('roles')
  @ApiOperation({ 
    summary: 'Get all roles',
    description: 'Retrieve all available roles with their permissions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Roles retrieved successfully',
    example: [
      {
        id: 1,
        name: 'Super Admin',
        type: 'admin',
        permissions: {
          users: { create: true, read: true, update: true, delete: true }
        },
        users_count: 2,
        is_active: true
      },
      {
        id: 2,
        name: 'Manager',
        type: 'manager',
        permissions: {
          products: { create: true, read: true, update: true }
        },
        users_count: 5,
        is_active: true
      }
    ]
  })
  getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('roles')
  @ApiOperation({ 
    summary: 'Create new role',
    description: 'Create a new role with specific permissions'
  })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Role created successfully',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 3,
        name: 'Product Manager',
        type: 'staff',
        permissions: {
          products: { create: true, read: true, update: true }
        }
      }
    }
  })
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.adminService.createRole(createRoleDto);
  }

  @Get('system-info')
  @ApiOperation({ 
    summary: 'Get system information',
    description: 'Retrieve system version, configuration, and status information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'System information retrieved successfully',
    example: {
      version: '1.0.0',
      environment: 'production',
      database: {
        type: 'postgresql',
        version: '15.0',
        status: 'connected'
      },
      features: {
        swagger_docs: true,
        jwt_auth: true,
        role_based_access: true,
        file_upload: false
      },
      statistics: {
        total_users: 1250,
        total_products: 156,
        total_orders: 3420,
        uptime: '15 days'
      }
    }
  })
  getSystemInfo() {
    return this.adminService.getSystemInfo();
  }
}
