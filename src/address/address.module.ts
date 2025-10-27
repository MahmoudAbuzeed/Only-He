import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { Address } from "./entities/address.entity";
import { AddressRepository } from "./repositories/address.repository";
import { UserModule } from "../user/user.module";
import { ErrorHandler } from "shared/errorHandler.service";
import { Logger } from "shared/logger/logger.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
    }),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository, ErrorHandler, Logger],
  exports: [AddressService, AddressRepository],
})
export class AddressModule {}
