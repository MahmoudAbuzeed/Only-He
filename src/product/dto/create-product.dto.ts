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
  @IsOptional()
  name_en?: string;

  @IsString()
  @IsOptional()
  name_ar?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  description_ar?: string;

  @IsString()
  @IsOptional()
  short_description_en?: string;

  @IsString()
  @IsOptional()
  short_description_ar?: string;

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

  @IsString()
  @IsOptional()
  meta_title_en?: string;

  @IsString()
  @IsOptional()
  meta_title_ar?: string;

  @IsString()
  @IsOptional()
  meta_description_en?: string;

  @IsString()
  @IsOptional()
  meta_description_ar?: string;

  @IsObject()
  @IsOptional()
  seo_data?: { slug?: string; [key: string]: any };

  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
