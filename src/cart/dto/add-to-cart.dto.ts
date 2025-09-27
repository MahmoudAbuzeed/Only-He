import { IsNumber, IsOptional, IsEnum, IsObject, Min } from 'class-validator';
import { CartItemType } from '../entities/cart-item.entity';

export class AddToCartDto {
  @IsEnum(CartItemType)
  item_type: CartItemType;

  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber()
  @IsOptional()
  package_id?: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsObject()
  @IsOptional()
  product_options?: Record<string, any>; // For product variants (size, color, etc.)
}
