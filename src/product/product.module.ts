import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "./entities/product.entity";
import { ProductRepo } from "./product.repository";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, ErrorHandler],
})
export class ProductModule {}
