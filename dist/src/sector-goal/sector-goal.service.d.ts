import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';
import { SectorGoalRepo } from './sector-goal.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class SectorGoalService {
    private readonly sectorGoalRepo;
    private readonly errorHandler;
    constructor(sectorGoalRepo: SectorGoalRepo, errorHandler: ErrorHandler);
    create(createSectorGoalDto: CreateSectorGoalDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/sector-goal.entity").SectorGoal[]>;
    findOne(id: number): Promise<import("./entities/sector-goal.entity").SectorGoal>;
    update(id: number, updateSectorGoalDto: UpdateSectorGoalDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
