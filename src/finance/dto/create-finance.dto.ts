import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class CreateFinanceDto {
  @IsString()
  bank_name: string;

  @IsNumber()
  account_number: number;

  @IsString()
  first_withdrawal_date: Date;

  @IsString()
  final_withdrawal_date: Date;

  @IsString()
  account_activation_date: Date;

  @IsString()
  general_information: string;

  @IsNumber()
  @IsNotEmpty()
  project: Project;
}
