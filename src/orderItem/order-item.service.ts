import { Injectable } from "@nestjs/common";

import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItemRepo } from "./order-item.repository";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepo: OrderItemRepo) {}

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

  async upsertOrderItemWithOptions(orderId: number, data: any) {
    const orderItems = await this.orderItemRepo.findManyWithOptions({ where: { orderId } });
    // Update existing items
    for (const orderItem of orderItems) {
      const dataToUpdate = data.find((item) => item.productId === orderItem.productId);
      if (dataToUpdate) {
        await this.orderItemRepo.updateOneWithOptions(orderItem.id, {
          quantity: dataToUpdate.quantity,
        });
      }
    }

    // Add new items
    for (const item of data) {
      const exists = orderItems.some((orderItem) => orderItem.productId === item.productId);
      if (!exists) {
        await this.orderItemRepo.create({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }
  }
}
