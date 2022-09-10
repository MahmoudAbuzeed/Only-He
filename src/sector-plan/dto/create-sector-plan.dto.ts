import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Sector } from 'src/sector/entities/sector.entity';

export class CreateSectorPlanDto {
  @IsString() // override the default message
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  reference_id: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  sector: Sector;
}
