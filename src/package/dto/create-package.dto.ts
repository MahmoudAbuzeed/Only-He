import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PackageStatus } from '../entities/package.entity';

export class PackageProductDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  unit_price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sort_order?: number = 0;
}

export class CreatePackageDto {
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
  @IsNotEmpty()
  sku: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  original_price?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  discount_percentage?: number = 0;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus = PackageStatus.ACTIVE;

  @IsDateString()
  @IsOptional()
  valid_from?: Date;

  @IsDateString()
  @IsOptional()
  valid_until?: Date;

  @IsNumber()
  @Min(0)
  @IsOptional()
  max_quantity_per_order?: number = 0;

  @IsOptional()
  is_featured?: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  terms_and_conditions?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageProductDto)
  @IsNotEmpty()
  products: PackageProductDto[];
}
