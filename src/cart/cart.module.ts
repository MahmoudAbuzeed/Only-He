import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart-item.entity";
import { CartRepository } from "./repositories/cart.repository";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";
import { ImagesModule } from "../images/images.module";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductModule,
    UserModule,
    ImagesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
    }),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ErrorHandler],
  exports: [CartService, CartRepository],
})
export class CartModule {}
