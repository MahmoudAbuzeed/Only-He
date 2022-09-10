import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Department } from 'src/department/entities/department.entity';

export class CreateProjectDto {
  @IsString({ message: 'must be string' }) // override the default message
  @IsNotEmpty({ message: 'must  not be string' })
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
  status: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  finance_approval: boolean;

  @IsOptional()
  @IsBoolean()
  gl_approval: boolean;

  @IsArray()
  components: any;

  @IsArray()
  activities: any;

  @IsArray()
  attachments: any;

  @IsNotEmpty()
  history: any;

  @IsNotEmpty()
  finance: any;

  @IsNumber()
  @IsNotEmpty()
  department: Department;

  @IsOptional()
  @IsArray()
  assignedProjectSectors: number[];

  @IsOptional()
  @IsArray()
  assignedProjectDonors: number[];
}
