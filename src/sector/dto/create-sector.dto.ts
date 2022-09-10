import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class CreateSectorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  project: Project;
}
