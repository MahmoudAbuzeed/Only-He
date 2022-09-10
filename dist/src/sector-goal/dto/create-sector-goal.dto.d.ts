import { SectorPlan } from 'src/sector-plan/entities/sector-plan.entity';
export declare class CreateSectorGoalDto {
    name: string;
    pillars: string;
    description: string;
    type: string;
    start_date: Date;
    end_date: Date;
    sectorPlan: SectorPlan;
}
