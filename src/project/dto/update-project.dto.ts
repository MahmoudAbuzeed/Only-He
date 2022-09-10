import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Department } from 'src/department/entities/department.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsString({ message: 'must be string' }) // override the default message
  name: string;

  @IsOptional()
  @IsString()
  reference_id: string;

  @IsOptional()
  @IsNumber()
  budget: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date: Date;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  finance_approval: boolean;

  @IsOptional()
  @IsBoolean()
  gl_approval: boolean;

  @IsOptional()
  @IsArray()
  components: any;

  @IsOptional()
  @IsArray()
  activities: any;

  @IsOptional()
  @IsArray()
  attachments: any;

  history: any;

  finance: any;

  @IsOptional()
  @IsNumber()
  department: Department;

  @IsOptional()
  @IsArray()
  assignedProjectSectors: number[];

  @IsOptional()
  @IsArray()
  assignedProjectDonors: number[];

  @IsOptional()
  @IsArray()
  sectors: number[];
}
