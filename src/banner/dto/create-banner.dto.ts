import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  MaxLength,
} from "class-validator";
import { BannerActionType } from "../entities/banner.entity";

export class CreateBannerDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title_en?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  title_ar?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @IsString()
  description_ar?: string;

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsUrl()
  mobileImageUrl?: string;

  @IsOptional()
  @IsUrl()
  tabletImageUrl?: string;

  @IsOptional()
  @IsEnum(BannerActionType)
  actionType?: BannerActionType;

  @IsOptional()
  @IsString()
  actionValue?: string;

  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  buttonText_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  buttonText_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  textColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  backgroundColor?: string;
}
