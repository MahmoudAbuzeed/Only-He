import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignInDto {
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
    example: 'securePassword123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
