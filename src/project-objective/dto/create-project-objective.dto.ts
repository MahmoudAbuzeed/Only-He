import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class CreateProjectObjectiveDto {
  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsNumber()
  @IsNotEmpty()
  project: Project;
}
