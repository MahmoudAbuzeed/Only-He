import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ 
    example: 'Home', 
    description: 'Address label/nickname (e.g., Home, Work, Parents)' 
  })
  @IsString()
  @IsNotEmpty()
  label: string;

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

  @ApiPropertyOptional({ 
    example: false, 
    description: 'Set as default shipping address',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  is_default_shipping?: boolean;

  @ApiPropertyOptional({ 
    example: false, 
    description: 'Set as default billing address',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  is_default_billing?: boolean;
}

