import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';
import { Sector } from 'src/sector/entities/sector.entity';

export class CreateComponentDto {
  @IsString()
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

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  approval_requirements: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  start_date: Date;

  @IsString()
  @IsNotEmpty()
  end_date: Date;

  @IsNumber()
  // @IsNotEmpty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  project: Project;

  @IsNumber()
  @IsNotEmpty()
  sectors: Sector[];
}
