import { Injectable } from "@nestjs/common";

import { CREATED_SUCCESSFULLY, DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { ErrorHandler } from "shared/errorHandler.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRepo } from "./order.repository";
import { OrderItemService } from "src/orderItem/order-item.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly orderItemService: OrderItemService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderRepo.create(createOrderDto);
      const orderItems = createOrderDto.orderItems.map((orderItem) => ({ ...orderItem, orderId: order.id }));
      await this.orderItemService.createMany(orderItems);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    return await this.orderRepo.findAll();
  }

  async findOne(id: number) {
    const Order = await this.orderRepo.findOne(id);
    if (!Order) throw this.errorHandler.notFound();
    return Order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderRepo.update(id, updateOrderDto);
    if (updatedOrder.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedOrder = await this.orderRepo.remove(+id);
    if (deletedOrder.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
