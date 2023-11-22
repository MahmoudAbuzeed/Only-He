import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Order } from "./entities/order.entity";
import { OrderRepo } from "./order.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { OrderItemService } from "src/orderItem/order-item.service";
import { OrderItemModule } from "src/orderItem/order-item.module";
import { OrderItem } from "src/orderItem/entities/order-item.entity";
import { OrderItemRepo } from "src/orderItem/order-item.repository";
import { ProductModule } from "src/product/product.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), OrderItemModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo, ErrorHandler, OrderItemService, OrderItemRepo],
})
export class OrderModule {}
