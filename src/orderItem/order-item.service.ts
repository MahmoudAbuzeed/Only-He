import { Injectable } from "@nestjs/common";

import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { ErrorHandler } from "shared/errorHandler.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItemRepo } from "./order-item.repository";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepo: OrderItemRepo, private readonly errorHandler: ErrorHandler) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      return await this.orderItemRepo.create(createOrderItemDto);
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  createMany(createOrderItemDto: CreateOrderItemDto[]) {
    try {
      return this.orderItemRepo.createMany(createOrderItemDto);
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  async findAll() {
    return await this.orderItemRepo.findAll();
  }

  async findWithOption(options: any) {
    return await this.orderItemRepo.findWithOption(options);
  }

  async findOne(id: number) {
    const OrderItem = await this.orderItemRepo.findOne(id);
    if (!OrderItem) throw new CustomError(401, "Order Items Not Found");
    return OrderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const updatedOrderItem = await this.orderItemRepo.update(id, updateOrderItemDto);
    if (updatedOrderItem.affected == 0) throw new CustomError(401, "Order Items Not Found");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedOrderItem = await this.orderItemRepo.remove(+id);
    if (deletedOrderItem.affected == 0) throw new CustomError(401, "Order Items Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
