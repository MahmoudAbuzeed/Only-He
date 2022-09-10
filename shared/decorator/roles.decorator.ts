import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/guards.enum';

export const ROLES_KEY = 'roles';
export const RolesGuard = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
