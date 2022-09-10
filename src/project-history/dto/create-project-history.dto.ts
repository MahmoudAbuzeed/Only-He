import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class CreateProjectHistoryDto {
  @IsString()
  @IsNotEmpty()
  from_status: string;

  @IsString()
  @IsNotEmpty()
  to_status: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  editor_id: string;

  @IsString()
  @IsNotEmpty()
  department_type: string;

  @IsNumber()
  @IsNotEmpty()
  project: Project;
}
