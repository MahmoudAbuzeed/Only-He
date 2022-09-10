import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Component } from 'src/component/entities/component.entity';
import { Sector } from 'src/sector/entities/sector.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  approval_requirements: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsNumber()
  @IsNotEmpty()
  man_power: number;

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
  component: Component;

  @IsNumber()
  @IsNotEmpty()
  sectors: Sector[];
}
