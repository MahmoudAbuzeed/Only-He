import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Department } from 'src/department/entities/department.entity';
import { Sector } from 'src/sector/entities/sector.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsOptional()
  sector: Sector;

  @IsNumber()
  @IsOptional()
  department: Department;
}
