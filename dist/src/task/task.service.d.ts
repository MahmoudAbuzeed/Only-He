import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepo } from './task.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { Sector } from 'src/sector/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';
export declare class TaskService {
    private readonly taskRepo;
    private readonly errorHandler;
    private readonly sectorService;
    constructor(taskRepo: TaskRepo, errorHandler: ErrorHandler, sectorService: SectorService);
    getSectors(sectors: any): Promise<Sector[]>;
    create(createTaskDto: CreateTaskDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: number): Promise<import("./entities/task.entity").Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<{
        message: string;
    }>;
    updateComponentSectors(id: number, updateTaskDto: UpdateTaskDto): Promise<{
        message: string;
    }>;
    updateActivitiesSectors(tasks: any, sectors: any): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
