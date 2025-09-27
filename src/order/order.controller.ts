import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // TODO: Extract user ID from JWT token
    const userId = req.user?.id || 1;
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get()
  getMyOrders(@Request() req) {
    const userId = req.user?.id || 1;
    return this.orderService.getOrdersByUser(userId);
  }

  @Get(':id')
  getOrderById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1;
    return this.orderService.getOrderById(userId, id);
  }

  // Admin endpoint to update order status
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
