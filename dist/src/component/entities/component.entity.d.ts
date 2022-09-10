import { Project } from 'src/project/entities/project.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
export declare class Component {
    id: number;
    name: string;
    reference_id: string;
    budget: number;
    type: string;
    description: string;
    approval_requirements: string;
    priority: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    project: Project;
    sectors: Sector[];
    stackHolders: StackHolder[];
}
