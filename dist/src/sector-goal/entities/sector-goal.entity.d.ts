import { SectorPlan } from 'src/sector-plan/entities/sector-plan.entity';
export declare class SectorGoal {
    id: number;
    name: string;
    pillars: string;
    description: string;
    type: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    sectorPlan: SectorPlan;
}
