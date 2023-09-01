import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderRepo {
  constructor(
    @InjectRepository(Order)
    private OrderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.OrderRepository.save(createOrderDto);
  }

  async findAll() {
    return await this.OrderRepository.find();
  }

  async findOne(id: number) {
    return await this.OrderRepository.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.OrderRepository.update(id, updateOrderDto);
  }

  async remove(id: number) {
    return await this.OrderRepository.delete({ id });
  }
}
