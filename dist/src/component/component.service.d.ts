import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentRepo } from './component.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { SectorService } from 'src/sector/sector.service';
import { Sector } from 'src/sector/entities/sector.entity';
import { TaskService } from 'src/task/task.service';
export declare class ComponentService {
    private readonly componentRepo;
    private readonly errorHandler;
    private readonly sectorService;
    private readonly taskService;
    constructor(componentRepo: ComponentRepo, errorHandler: ErrorHandler, sectorService: SectorService, taskService: TaskService);
    getSectors(sectors: any): Promise<Sector[]>;
    create(createComponentDto: CreateComponentDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/component.entity").Component[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateComponentDto: UpdateComponentDto): Promise<{
        message: string;
    }>;
    updateComponentSectors(id: number, updateComponentDto: UpdateComponentDto): Promise<{
        message: string;
    }>;
    updateComponentsSectors(components: any, sectors: any): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
