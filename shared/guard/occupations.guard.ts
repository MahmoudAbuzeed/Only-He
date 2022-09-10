import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OCCUPATIONS_KEY } from '../decorator/occupation.decorator';
import { Occupation } from '../types/guards.enum';

@Injectable()
export class OccupationsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredOccupations = this.reflector.getAllAndOverride<Occupation[]>(
      OCCUPATIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredOccupations) {
      return true;
    }
    const { user, headers } = context.switchToHttp().getRequest();
    if (
      requiredOccupations.some(
        (occupation) =>
          user.organization
            ?.find((org) => org._id == headers.organization)
            ?.clinic.find((clinic) => clinic._id == headers.clinic)?.role ==
          occupation,
      )
    )
      return true;
    else
      throw new UnauthorizedException('guess you have the wrong occupation!');
  }
}
