import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ImageType } from '../entities/image.entity';

export class UploadImageDto {
  @ApiProperty({
    enum: ImageType,
    description: 'Type of entity the image belongs to',
    example: ImageType.PRODUCT,
  })
  @IsEnum(ImageType)
  entity_type: ImageType;

  @ApiProperty({
    description: 'ID of the entity the image belongs to',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  entity_id: number;

  @ApiProperty({
    description: 'Alternative text for the image',
    required: false,
    example: 'Product main image',
  })
  @IsOptional()
  @IsString()
  alt_text?: string;

  @ApiProperty({
    description: 'Caption for the image',
    required: false,
    example: 'High quality product image',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    description: 'Whether this is the primary image for the entity',
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_primary?: boolean;

  @ApiProperty({
    description: 'Sort order for displaying images',
    required: false,
    default: 0,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  sort_order?: number;
}
