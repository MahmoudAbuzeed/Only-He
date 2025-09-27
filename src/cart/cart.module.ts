import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartRepository } from './cart.repository';
import { ProductModule } from '../product/product.module';
import { ErrorHandler } from 'shared/errorHandler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ErrorHandler],
  exports: [CartService, CartRepository],
})
export class CartModule {}
