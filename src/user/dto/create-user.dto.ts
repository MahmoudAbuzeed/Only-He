import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ 
    description: 'User first name',
    example: 'John',
    maxLength: 40
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ 
    description: 'User last name',
    example: 'Doe',
    maxLength: 40
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ 
    description: 'Unique username',
    example: 'johndoe',
    maxLength: 40
  })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiPropertyOptional({ 
    description: 'User email address (required if phone not provided)',
    example: 'john@example.com'
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'User phone number (required if email not provided)',
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'securePassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
