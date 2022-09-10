import { Task } from 'src/task/entities/task.entity';
export declare class CreateTaskReferenceDto {
    parent_id: number;
    child_id: number;
    task: Task[];
}
