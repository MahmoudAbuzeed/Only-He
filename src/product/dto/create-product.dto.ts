import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  offer: number;

  @IsNotEmpty()
  customer_price: number;

  @IsNotEmpty()
  original_price: number;

  @IsNotEmpty()
  category: any;
}
