import { IsNotEmpty } from "class-validator";

export class CreateOrderItemDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  productId: number;
}
