import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";

import { User } from "./entities/user.entity";
import { UserRepo } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { ErrorHandler } from "shared/errorHandler.service";
import { Logger } from "shared/logger/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepo, JwtService, ErrorHandler, Logger],
})
export class UserModule {}
