import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { OrderItem } from '../order/entities/order-item.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { CategoryModule } from '../category/category.module';
import { ImagesModule } from '../images/images.module';
import { ErrorHandler } from 'shared/errorHandler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, OrderItem, CartItem]),
    CategoryModule, // Import CategoryModule to access CategoryRepository
    ImagesModule, // Import ImagesModule to access ImagesService
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ErrorHandler],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
