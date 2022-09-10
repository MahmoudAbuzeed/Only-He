import { Sector } from 'src/sector/entities/sector.entity';
export declare class SectorPlan {
    id: number;
    name: string;
    reference_id: string;
    budget: number;
    type: string;
    start_date: Date;
    end_date: Date;
    description: string;
    created_at: Date;
    updated_at: Date;
    sector: Sector;
}
