import { SectorPlanService } from './sector-plan.service';
import { CreateSectorPlanDto } from './dto/create-sector-plan.dto';
import { UpdateSectorPlanDto } from './dto/update-sector-plan.dto';
export declare class SectorPlanController {
    private readonly sectorPlanService;
    constructor(sectorPlanService: SectorPlanService);
    create(createSectorPlanDto: CreateSectorPlanDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector-plan.entity").SectorPlan[]>;
    findOne(id: string): Promise<import("./entities/sector-plan.entity").SectorPlan>;
    update(id: string, updateSectorPlanDto: UpdateSectorPlanDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
