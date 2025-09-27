import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { ErrorHandler } from 'shared/errorHandler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ErrorHandler],
  exports: [OrderService],
})
export class OrderModule {}
