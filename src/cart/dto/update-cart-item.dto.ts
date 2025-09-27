import { IsNumber, IsOptional, IsObject, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsObject()
  @IsOptional()
  product_options?: Record<string, any>;
}
