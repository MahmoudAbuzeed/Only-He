import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { CartModule } from "../cart/cart.module";
import { ProductModule } from "../product/product.module";
import { AddressModule } from "../address/address.module";
import { UserModule } from "../user/user.module";
import { ImagesModule } from "../images/images.module";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    ProductModule,
    AddressModule,
    UserModule,
    ImagesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, ErrorHandler],
  exports: [OrderService],
})
export class OrderModule {}
