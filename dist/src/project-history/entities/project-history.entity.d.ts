import { Project } from 'src/project/entities/project.entity';
export declare class ProjectHistory {
    id: number;
    from_status: string;
    to_status: string;
    message: string;
    editor_id: string;
    department_type: string;
    created_at: Date;
    updated_at: Date;
    project: Project;
}
