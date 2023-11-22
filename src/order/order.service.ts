import { Injectable } from "@nestjs/common";
import { In } from "typeorm";

import { DELETED_SUCCESSFULLY } from "messages";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRepo } from "./order.repository";
import { OrderItemService } from "src/orderItem/order-item.service";
import { CustomError } from "shared/custom-error/custom-error";
import { ProductService } from "src/product/product.service";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly orderItemService: OrderItemService,
    private readonly productService: ProductService,
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
    const order = await this.orderRepo.findOne(id);
    order.user = order?.user?.user_name as any;
    const orderItemIds = await this.orderItemService.findWithOption({ where: { orderId: id } });
    const orderItems = await this.productService.findWithOption({
      where: {
        id: In(orderItemIds.map((item) => item.productId)),
      },
    });
    order.orderItems = orderItems;
    if (!order) throw new CustomError(401, "Order Not Found");
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = new Order();
    order.id = id;
    order.status = updateOrderDto.status;
    order.user = updateOrderDto.userId as any;
    order.total_price = updateOrderDto.total_price;

    await this.orderRepo.update(id, order);
    await this.orderItemService.upsertOrderItemWithOptions(id, updateOrderDto.orderItems);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const deletedOrder = await this.orderRepo.remove(+id);
    if (deletedOrder.affected == 0) throw new CustomError(401, "Order Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
