import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { Favorite } from "./entities/favorite.entity";
import { FavoriteRepository } from "./repositories/favorite.repository";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";
import { ImagesModule } from "../images/images.module";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    ProductModule,
    UserModule,
    ImagesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
    }),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository, ErrorHandler],
  exports: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
