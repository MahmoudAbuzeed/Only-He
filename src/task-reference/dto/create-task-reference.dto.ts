import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Task } from 'src/task/entities/task.entity';

export class CreateTaskReferenceDto {
  @IsNumber()
  @IsNotEmpty()
  parent_id: number;

  @IsNumber()
  @IsNotEmpty()
  child_id: number;

  @IsNumber()
  @IsNotEmpty()
  task: Task[];
}
