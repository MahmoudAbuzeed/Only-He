import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToFavoritesDto {
  @IsNumber()
  product_id: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
