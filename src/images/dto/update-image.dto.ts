import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({
    description: 'Alternative text for the image',
    required: false,
  })
  @IsOptional()
  @IsString()
  alt_text?: string;

  @ApiProperty({
    description: 'Caption for the image',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    description: 'Whether this is the primary image for the entity',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @ApiProperty({
    description: 'Sort order for displaying images',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiProperty({
    description: 'Whether the image is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
