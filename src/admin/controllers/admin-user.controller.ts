import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUserService } from '../services/admin-user.service';
import { AdminGuard } from '../guards/admin.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { AssignRoleDto } from '../dto/assign-role.dto';

@ApiTags('Admin - User Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard, PermissionsGuard)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  @RequirePermissions({ resource: 'users', action: 'create' })
  @ApiOperation({ 
    summary: 'Create new user (Admin)',
    description: 'Create a new user account with specified roles and permissions'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        user_name: 'johndoe',
        email: 'john@example.com',
        roles: []
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminUserService.createUser(createUserDto);
  }

  @Get()
  @RequirePermissions({ resource: 'users', action: 'read' })
  @ApiOperation({ 
    summary: 'Get all users (Admin)',
    description: 'Retrieve all users with pagination, filtering, and role information'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email', example: 'john' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by role', example: 'admin' })
  @ApiQuery({ name: 'is_active', required: false, description: 'Filter by active status', example: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    example: {
      users: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          roles: [{ id: 1, name: 'Admin', type: 'admin' }],
          is_active: true,
          last_login: '2024-01-15T10:30:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  })
  getAllUsers(@Query() filters: any) {
    return this.adminUserService.getAllUsers(filters);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'users', action: 'read' })
  @ApiOperation({ 
    summary: 'Get user by ID (Admin)',
    description: 'Retrieve detailed user information including roles and permissions'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    example: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      roles: [
        {
          id: 1,
          name: 'Admin',
          type: 'admin',
          permissions: {
            users: { create: true, read: true, update: true, delete: true }
          }
        }
      ],
      is_active: true,
      last_login: '2024-01-15T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z'
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminUserService.getUserById(id);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'users', action: 'update' })
  @ApiOperation({ 
    summary: 'Update user (Admin)',
    description: 'Update user information and status'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminUserService.updateUser(id, updateUserDto);
  }

  @Post(':id/assign-role')
  @RequirePermissions({ resource: 'users', action: 'assign_roles' })
  @ApiOperation({ 
    summary: 'Assign role to user',
    description: 'Assign or remove roles from a user'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: AssignRoleDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Role assigned successfully',
    example: { message: 'Role assigned successfully' }
  })
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.adminUserService.assignRole(id, assignRoleDto);
  }

  @Patch(':id/toggle-status')
  @RequirePermissions({ resource: 'users', action: 'update' })
  @ApiOperation({ 
    summary: 'Toggle user active status',
    description: 'Activate or deactivate a user account'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User status updated',
    example: { 
      message: 'User status updated successfully',
      is_active: false
    }
  })
  toggleUserStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminUserService.toggleUserStatus(id);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'users', action: 'delete' })
  @ApiOperation({ 
    summary: 'Delete user (Admin)',
    description: 'Permanently delete a user account'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    example: { message: 'DELETED_SUCCESSFULLY' }
  })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminUserService.deleteUser(id);
  }

  @Get(':id/activity')
  @RequirePermissions({ resource: 'users', action: 'read' })
  @ApiOperation({ 
    summary: 'Get user activity',
    description: 'Retrieve user activity history including orders, cart, and favorites'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User activity retrieved',
    example: {
      orders_count: 5,
      total_spent: 2499.95,
      cart_items: 3,
      favorites_count: 12,
      last_order: '2024-01-15T10:30:00Z',
      registration_date: '2024-01-01T00:00:00Z'
    }
  })
  getUserActivity(@Param('id', ParseIntPipe) id: number) {
    return this.adminUserService.getUserActivity(id);
  }
}
