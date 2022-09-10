import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../types/guards.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user, headers } = context.switchToHttp().getRequest();
    if (
      requiredRoles.some(
        (role) =>
          user.organizations?.find((org) => org._id == headers.organization)
            ?.role == role,
      )
    )
      return true;
    else throw new UnauthorizedException('guess you have the wrong role!');
  }
}
