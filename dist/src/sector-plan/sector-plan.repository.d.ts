import { Repository } from 'typeorm';
import { CreateSectorPlanDto } from './dto/create-sector-plan.dto';
import { UpdateSectorPlanDto } from './dto/update-sector-plan.dto';
import { SectorPlan } from './entities/sector-plan.entity';
export declare class SectorPlanRepo {
    private sectorPlanRepository;
    constructor(sectorPlanRepository: Repository<SectorPlan>);
    create(createSectorPlantDto: CreateSectorPlanDto): Promise<CreateSectorPlanDto & SectorPlan>;
    findAll(): Promise<SectorPlan[]>;
    findOne(id: number): Promise<SectorPlan>;
    update(id: number, updateSectorPlanDto: UpdateSectorPlanDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
