import { Global, Module } from '@nestjs/common';
import { ErrorHandler } from './errorHandler.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { OccupationsGuard } from './guard/occupations.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    ErrorHandler,

    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OccupationsGuard,
    },
  ],
  exports: [ErrorHandler, JwtModule, JwtStrategy],
})
export class SharedModule {}
