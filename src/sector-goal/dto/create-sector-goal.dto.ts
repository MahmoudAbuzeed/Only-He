import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SectorPlan } from 'src/sector-plan/entities/sector-plan.entity';

export class CreateSectorGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  pillars: string;
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @IsNumber()
  @IsNotEmpty()
  sectorPlan: SectorPlan;
}
