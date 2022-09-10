import { Project } from 'src/project/entities/project.entity';
import { Sector } from 'src/sector/entities/sector.entity';
export declare class CreateComponentDto {
    name: string;
    reference_id: string;
    budget: number;
    type: string;
    description: string;
    approval_requirements: string;
    priority: string;
    start_date: Date;
    end_date: Date;
    weight: number;
    project: Project;
    sectors: Sector[];
}
