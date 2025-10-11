import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({ example: 'Acme Corp', description: 'Company name (optional)' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: '123 Main Street', description: 'Street address line 1' })
  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @ApiPropertyOptional({ example: 'Apt 4B', description: 'Street address line 2 (optional)' })
  @IsString()
  @IsOptional()
  address_line_2?: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'NY', description: 'State or province' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '10001', description: 'Postal or ZIP code' })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ example: 'United States', description: 'Country' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number (optional)' })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'Shipping address',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  shipping_address: AddressDto;

  @ApiPropertyOptional({ 
    description: 'Billing address (optional, defaults to shipping address if not provided)',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billing_address?: AddressDto;

  @ApiPropertyOptional({ 
    example: 'standard', 
    description: 'Shipping method (e.g., standard, express, overnight)',
    default: 'standard'
  })
  @IsString()
  @IsOptional()
  shipping_method?: string = 'standard';

  @ApiPropertyOptional({ 
    example: 'cash_on_delivery', 
    description: 'Payment method (e.g., cash_on_delivery, credit_card, paypal)',
    default: 'cash_on_delivery'
  })
  @IsString()
  @IsOptional()
  payment_method?: string = 'cash_on_delivery';

  @ApiPropertyOptional({ 
    example: 'Please deliver after 5 PM', 
    description: 'Additional notes or instructions for the order'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    example: 'SAVE10', 
    description: 'Coupon or promo code'
  })
  @IsString()
  @IsOptional()
  coupon_code?: string;
}
