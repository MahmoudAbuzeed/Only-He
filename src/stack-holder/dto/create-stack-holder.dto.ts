import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class CreateStackHolderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsNumber()
  @IsOptional()
  project: Project;
}
