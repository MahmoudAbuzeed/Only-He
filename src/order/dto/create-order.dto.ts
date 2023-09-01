import { IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  status: OrderStatus;

  @IsNotEmpty()
  total_price: number;

  @IsNotEmpty()
  orderItems: any[];

  @IsNotEmpty()
  userId: number;
}
