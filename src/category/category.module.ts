import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Category } from "./entities/category.entity";
import { CategoryRepository } from "./repositories/category.repository";
import { ImagesModule } from "../images/images.module";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ImagesModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, ErrorHandler],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
