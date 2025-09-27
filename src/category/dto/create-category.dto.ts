import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsNumber()
  @IsOptional()
  sort_order?: number = 0;

  @IsNumber()
  @IsOptional()
  parent_id?: number;
}
