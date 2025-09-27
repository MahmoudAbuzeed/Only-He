import { Injectable } from '@nestjs/common';
import { UserRepo } from '../../user/user.repository';
import { RoleRepo } from '../../role/role.repository';
import { CartRepository } from '../../cart/cart.repository';
import { FavoriteRepository } from '../../favorite/favorite.repository';
import { OrderService } from '../../order/order.service';
import { ErrorHandler } from 'shared/errorHandler.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { CREATED_SUCCESSFULLY, UPDATED_SUCCESSFULLY, DELETED_SUCCESSFULLY } from 'messages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly roleRepository: RoleRepo,
    private readonly cartRepository: CartRepository,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly orderService: OrderService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Validate that either email or phone is provided
      if (!createUserDto.email && !createUserDto.phone) {
        throw this.errorHandler.badRequest({ message: 'Either email or phone number is required' });
      }

      // Hash password
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      createUserDto.password = hashedPassword;

      const user = await this.userRepository.create(createUserDto);
      
      // Remove password from response
      const { password, ...userResponse } = user;
      
      return {
        message: CREATED_SUCCESSFULLY,
        data: userResponse,
      };
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.duplicateValue(error);
    }
  }

  async getAllUsers(filters: any) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        role,
        is_active,
      } = filters;

      const skip = (page - 1) * limit;

      // Build query
      let queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .select([
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.user_name',
          'user.email',
          'user.phone',
          'user.is_active',
          'user.last_login',
          'user.created_at',
          'user.updated_at',
          'role.id',
          'role.name',
          'role.type',
        ]);

      // Apply filters
      if (search) {
        queryBuilder = queryBuilder.where(
          '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (role) {
        queryBuilder = queryBuilder.andWhere('role.name ILIKE :role', { role: `%${role}%` });
      }

      if (is_active !== undefined) {
        queryBuilder = queryBuilder.andWhere('user.is_active = :isActive', { isActive: is_active === 'true' });
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination and get results
      const users = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('user.created_at', 'DESC')
        .getMany();

      return {
        users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.userRepository.findOneWithRoles(id);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      // Hash password if provided
      if (updateUserDto.password) {
        const saltOrRounds = 10;
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
      }

      const result = await this.userRepository.update(id, updateUserDto);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async assignRole(userId: number, assignRoleDto: AssignRoleDto) {
    try {
      const user = await this.userRepository.findOneWithRoles(userId);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      // Validate that all role IDs exist
      for (const roleId of assignRoleDto.role_ids) {
        const role = await this.roleRepository.findOne(roleId);
        if (!role) {
          throw this.errorHandler.badRequest({ message: `Role with ID ${roleId} not found` });
        }
      }

      // Assign roles
      await this.userRepository.assignRoles(userId, assignRoleDto.role_ids);

      return { message: 'Role assigned successfully' };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async toggleUserStatus(id: number) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      const newStatus = !user.is_active;
      await this.userRepository.update(id, { is_active: newStatus });

      return {
        message: 'User status updated successfully',
        is_active: newStatus,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      // TODO: Check if user has active orders, you might want to prevent deletion
      // For now, we'll allow deletion

      const result = await this.userRepository.remove(id);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      return { message: DELETED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getUserActivity(id: number) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw this.errorHandler.notFound({ message: 'User not found' });
      }

      // Get user's cart
      const cart = await this.cartRepository.findActiveCartByUser(id);
      const cartItemsCount = cart ? await this.cartRepository.getCartItemCount(cart.id) : 0;

      // Get user's favorites count
      const favoritesCount = await this.favoriteRepository.getFavoriteCount(id);

      // Get real order statistics
      const ordersCount = await this.orderService.countByUser(id);
      const totalSpent = await this.orderService.getTotalSpentByUser(id);
      const lastOrderDate = await this.orderService.getLastOrderDate(id);

      return {
        orders_count: ordersCount,
        total_spent: totalSpent,
        cart_items: cartItemsCount,
        favorites_count: favoritesCount,
        last_order: lastOrderDate,
        registration_date: user.created_at,
        last_login: user.last_login,
        is_active: user.is_active,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }
}
