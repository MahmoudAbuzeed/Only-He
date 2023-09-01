import { Injectable } from "@nestjs/common";

import { CREATED_SUCCESSFULLY, DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { ErrorHandler } from "shared/errorHandler.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItemRepo } from "./order-item.repository";

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepo: OrderItemRepo, private readonly errorHandler: ErrorHandler) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      await this.orderItemRepo.create(createOrderItemDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  createMany(createOrderItemDto: CreateOrderItemDto[]) {
    try {
      return this.orderItemRepo.createMany(createOrderItemDto);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    return await this.orderItemRepo.findAll();
  }

  async findOne(id: number) {
    const OrderItem = await this.orderItemRepo.findOne(id);
    if (!OrderItem) throw this.errorHandler.notFound();
    return OrderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const updatedOrderItem = await this.orderItemRepo.update(id, updateOrderItemDto);
    if (updatedOrderItem.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedOrderItem = await this.orderItemRepo.remove(+id);
    if (deletedOrderItem.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
