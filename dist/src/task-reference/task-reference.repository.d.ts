import { Repository } from 'typeorm';
import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';
import { TaskReference } from './entities/task-reference.entity';
export declare class TaskReferenceRepo {
    private taskReferencesRepository;
    constructor(taskReferencesRepository: Repository<TaskReference>);
    create(createTaskReferenceDto: CreateTaskReferenceDto): Promise<CreateTaskReferenceDto & TaskReference>;
    findAll(): Promise<TaskReference[]>;
    findOne(id: number): Promise<TaskReference>;
    update(id: number, updateTaskReferenceDto: UpdateTaskReferenceDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
