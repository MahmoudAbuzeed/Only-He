import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';
import { TaskReferenceRepo } from './task-reference.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class TaskReferenceService {
    private readonly taskReferenceRepo;
    private readonly errorHandler;
    constructor(taskReferenceRepo: TaskReferenceRepo, errorHandler: ErrorHandler);
    create(createTaskReferenceDto: CreateTaskReferenceDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/task-reference.entity").TaskReference[]>;
    findOne(id: number): Promise<import("./entities/task-reference.entity").TaskReference>;
    update(id: number, updateTaskReferenceDto: UpdateTaskReferenceDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
