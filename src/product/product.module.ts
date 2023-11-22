import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "./entities/product.entity";
import { ProductRepo } from "./product.repository";
import { CategoryModule } from "src/category/category.module";
import { CategoryService } from "src/category/category.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, CategoryService],
  exports: [ProductService, ProductRepo],
})
export class ProductModule {}
