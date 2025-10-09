import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { FirebasePhoneAuthController } from "./controllers/firebase-phone-auth.controller";

import { User } from "./entities/user.entity";
import { UserRepo } from "./repositories/user.repository";
import { FirebasePhoneAuthService } from "./services/firebase-phone-auth.service";
import { FirebaseAuthHandlerService } from "./services/firebase-auth-handler.service";
import { JwtService } from "@nestjs/jwt";
import { ErrorHandler } from "shared/errorHandler.service";
import { Logger } from "shared/logger/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, FirebasePhoneAuthController],
  providers: [
    UserService,
    UserRepo,
    FirebasePhoneAuthService,
    FirebaseAuthHandlerService,
    JwtService,
    ErrorHandler,
    Logger,
  ],
  exports: [
    UserRepo,
    UserService,
    FirebasePhoneAuthService,
    FirebaseAuthHandlerService,
  ],
})
export class UserModule {}
