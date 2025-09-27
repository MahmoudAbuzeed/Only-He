import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from '../../user/user.repository';
import { RoleType } from '../../role/entities/role.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userRepository: UserRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract JWT token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Access token required');
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default-secret-key',
      });

      // Get user with roles
      const user = await this.userRepository.findOneWithRoles(payload.user.id);
      if (!user || !user.is_active) {
        throw new ForbiddenException('User not found or inactive');
      }

      // Check if user has admin role
      const hasAdminRole = user.roles?.some(role => 
        role.type === RoleType.ADMIN || role.type === RoleType.MANAGER
      );

      if (!hasAdminRole) {
        throw new ForbiddenException('Admin access required');
      }

      // Add user to request for use in controllers
      request.user = user;
      return true;

    } catch (error) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
