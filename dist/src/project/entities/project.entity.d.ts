import { Department } from 'src/department/entities/department.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
export declare class Project {
    [x: string]: any;
    id: number;
    name: string;
    reference_id: string;
    status: string;
    budget: number;
    type: string;
    start_date: Date;
    end_date: Date;
    description: string;
    finance_approval: boolean;
    gl_approval: boolean;
    created_at: Date;
    updated_at: Date;
    department: Department;
    sectors: Sector[];
    stackHolders: StackHolder[];
}
