import { Project } from 'src/project/entities/project.entity';
export declare class CreateProjectHistoryDto {
    from_status: string;
    to_status: string;
    message: string;
    editor_id: string;
    department_type: string;
    project: Project;
}
