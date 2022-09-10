import { SectorGoalService } from './sector-goal.service';
import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';
export declare class SectorGoalController {
    private readonly sectorGoalService;
    constructor(sectorGoalService: SectorGoalService);
    create(createSectorGoalDto: CreateSectorGoalDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector-goal.entity").SectorGoal[]>;
    findOne(id: string): Promise<import("./entities/sector-goal.entity").SectorGoal>;
    update(id: string, updateSectorGoalDto: UpdateSectorGoalDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
