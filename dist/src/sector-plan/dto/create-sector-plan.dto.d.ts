import { Sector } from 'src/sector/entities/sector.entity';
export declare class CreateSectorPlanDto {
    name: string;
    reference_id: string;
    budget: number;
    type: string;
    start_date: Date;
    end_date: Date;
    description: string;
    sector: Sector;
}
