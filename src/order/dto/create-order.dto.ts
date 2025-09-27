import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @IsString()
  @IsOptional()
  address_line_2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  shipping_address: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billing_address?: AddressDto;

  @IsString()
  @IsOptional()
  shipping_method?: string = 'standard';

  @IsString()
  @IsOptional()
  payment_method?: string = 'cash_on_delivery';

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  coupon_code?: string;
}
