import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderItemService } from "./order-item.service";
import { OrderItemController } from "./order-item.controller";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemRepo } from "./order-item.repository";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemController],
  providers: [OrderItemService, OrderItemRepo, ErrorHandler],
})
export class OrderItemModule {}
