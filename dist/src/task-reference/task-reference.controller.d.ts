import { TaskReferenceService } from './task-reference.service';
import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';
export declare class TaskReferenceController {
    private readonly taskReferenceService;
    constructor(taskReferenceService: TaskReferenceService);
    create(createTaskReferenceDto: CreateTaskReferenceDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/task-reference.entity").TaskReference[]>;
    findOne(id: string): Promise<import("./entities/task-reference.entity").TaskReference>;
    update(id: string, updateTaskReferenceDto: UpdateTaskReferenceDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
