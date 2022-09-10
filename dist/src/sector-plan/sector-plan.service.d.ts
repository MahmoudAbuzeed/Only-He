import { CreateSectorPlanDto } from './dto/create-sector-plan.dto';
import { UpdateSectorPlanDto } from './dto/update-sector-plan.dto';
import { SectorPlanRepo } from './sector-plan.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class SectorPlanService {
    private readonly sectorPlanRepo;
    private readonly errorHandler;
    constructor(sectorPlanRepo: SectorPlanRepo, errorHandler: ErrorHandler);
    create(createSectorPlanDto: CreateSectorPlanDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector-plan.entity").SectorPlan[]>;
    findOne(id: number): Promise<import("./entities/sector-plan.entity").SectorPlan>;
    update(id: number, updateSectorPlanDto: UpdateSectorPlanDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
