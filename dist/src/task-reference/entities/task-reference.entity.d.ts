import { Task } from 'src/task/entities/task.entity';
export declare class TaskReference {
    id: number;
    parent_id: number;
    child_id: number;
    created_at: Date;
    updated_at: Date;
    task: Task[];
}
