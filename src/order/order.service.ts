import { Injectable } from "@nestjs/common";

import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { ErrorHandler } from "shared/errorHandler.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRepo } from "./order.repository";
import { OrderItemService } from "src/orderItem/order-item.service";
import { CustomError } from "shared/custom-error/custom-error";

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
      return order;
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  async findAll() {
    const orders = await this.orderRepo.findAll();
    orders.map((order: any) => {
      order.user = order?.user?.user_name;
    });
    return orders;
  }

  async findOne(id: number) {
    const Order = await this.orderRepo.findOne(id);
    if (!Order) throw new CustomError(401, "Order Not Found");
    return Order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderRepo.update(id, updateOrderDto);
    if (updatedOrder.affected == 0) throw new CustomError(401, "Order Not Found");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedOrder = await this.orderRepo.remove(+id);
    if (deletedOrder.affected == 0) throw new CustomError(401, "Order Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
