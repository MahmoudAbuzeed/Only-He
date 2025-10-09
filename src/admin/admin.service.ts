import { Injectable } from '@nestjs/common';
import { UserRepo } from '../user/repositories/user.repository';
import { RoleRepo } from '../role/repositories/role.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CREATED_SUCCESSFULLY } from 'messages';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly roleRepository: RoleRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async getAdminProfile(userId: number) {
    try {
      const user = await this.userRepository.findOneWithRoles(userId);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'Admin user not found' });
      }

      // Remove sensitive information
      const { password, ...userProfile } = user;
      return userProfile;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getAdminPermissions(userId: number) {
    try {
      const user = await this.userRepository.findOneWithRoles(userId);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'Admin user not found' });
      }

      // Aggregate permissions from all roles
      const userPermissions = {};
      user.roles?.forEach(role => {
        if (role.permissions) {
          Object.keys(role.permissions).forEach(resource => {
            if (!userPermissions[resource]) {
              userPermissions[resource] = {};
            }
            Object.keys(role.permissions[resource]).forEach(action => {
              if (role.permissions[resource][action]) {
                userPermissions[resource][action] = true;
              }
            });
          });
        }
      });

      return {
        available_permissions: {
          users: ['create', 'read', 'update', 'delete', 'assign_roles'],
          products: ['create', 'read', 'update', 'delete', 'manage_stock'],
          categories: ['create', 'read', 'update', 'delete'],
          orders: ['read', 'update', 'cancel', 'refund', 'track'],
          packages: ['create', 'read', 'update', 'delete'],
          offers: ['create', 'read', 'update', 'delete'],
          analytics: ['view_dashboard', 'view_reports', 'export_data'],
        },
        user_permissions: userPermissions,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getAllRoles() {
    try {
      const roles = await this.roleRepository.findAllWithUserCount();
      return roles;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.roleRepository.create(createRoleDto);
      return {
        message: CREATED_SUCCESSFULLY,
        data: role,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getSystemInfo() {
    try {
      // Get basic statistics
      const totalUsers = await this.userRepository.count();
      // Note: You'll need to implement these count methods in respective repositories
      // const totalProducts = await this.productRepository.count();
      // const totalOrders = await this.orderRepository.count();

      return {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          type: 'postgresql',
          version: '15.0',
          status: 'connected',
        },
        features: {
          swagger_docs: true,
          jwt_auth: true,
          role_based_access: true,
          file_upload: false,
        },
        statistics: {
          total_users: totalUsers,
          total_products: 0, // TODO: Implement product count
          total_orders: 0, // TODO: Implement order count
          uptime: this.getUptime(),
        },
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  private getUptime(): string {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }
}
