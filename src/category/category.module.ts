import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Category } from "./entities/category.entity";
import { CategoryRepo } from "./category.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo],
  exports: [CategoryService, CategoryRepo],
})
export class CategoryModule {}
