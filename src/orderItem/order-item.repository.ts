import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "./entities/order-item.entity";

@Injectable()
@EntityRepository(OrderItem)
export class OrderItemRepo {
  constructor(
    @InjectRepository(OrderItem)
    private OrderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    return await this.OrderItemRepository.save(createOrderItemDto);
  }

  async findAll() {
    return await this.OrderItemRepository.find();
  }

  async findOne(id: number) {
    return await this.OrderItemRepository.findOne(id);
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return await this.OrderItemRepository.update(id, updateOrderItemDto);
  }

  async remove(id: number) {
    return await this.OrderItemRepository.delete({ id });
  }

  async createMany(createOrderItemDto: CreateOrderItemDto[]) {
    return await this.OrderItemRepository.save(createOrderItemDto);
  }

  async findWithOption(options: any) {
    return await this.OrderItemRepository.find(options);
  }
}
