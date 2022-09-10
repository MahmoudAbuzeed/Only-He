import { Department } from 'src/department/entities/department.entity';
export declare class CreateProjectDto {
    name: string;
    reference_id: string;
    budget: number;
    type: string;
    status: string;
    start_date: Date;
    end_date: Date;
    description: string;
    finance_approval: boolean;
    gl_approval: boolean;
    components: any;
    activities: any;
    attachments: any;
    history: any;
    finance: any;
    department: Department;
    assignedProjectSectors: number[];
    assignedProjectDonors: number[];
}
