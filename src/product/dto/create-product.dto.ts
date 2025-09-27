import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  Min,
  IsUrl,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  compare_price?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  cost_price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock_quantity?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  min_stock_level?: number = 0;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.ACTIVE;

  @IsBoolean()
  @IsOptional()
  is_featured?: boolean = false;

  @IsBoolean()
  @IsOptional()
  is_digital?: boolean = false;

  @IsBoolean()
  @IsOptional()
  manage_stock?: boolean = true;

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean = false;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @IsObject()
  @IsOptional()
  seo_data?: {
    meta_title?: string;
    meta_description?: string;
    slug?: string;
  };

  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
