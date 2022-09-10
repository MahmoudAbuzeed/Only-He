import { CreateProjectDto } from './create-project.dto';
import { Department } from 'src/department/entities/department.entity';
declare const UpdateProjectDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProjectDto>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
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
    sectors: number[];
}
export {};
