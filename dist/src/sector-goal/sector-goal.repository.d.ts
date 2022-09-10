import { Repository } from 'typeorm';
import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';
import { SectorGoal } from './entities/sector-goal.entity';
export declare class SectorGoalRepo {
    private sectorGoalRepository;
    constructor(sectorGoalRepository: Repository<SectorGoal>);
    create(createSectorGoalDto: CreateSectorGoalDto): Promise<CreateSectorGoalDto & SectorGoal>;
    findAll(): Promise<SectorGoal[]>;
    findOne(id: number): Promise<SectorGoal>;
    update(id: number, updateSectorGoalDto: UpdateSectorGoalDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
