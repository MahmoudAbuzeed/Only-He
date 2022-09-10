import { Project } from 'src/project/entities/project.entity';
export declare class Attachment {
    id: number;
    name: string;
    avatar_fd: string;
    size: number;
    storage_type: string;
    created_at: Date;
    updated_at: Date;
    project: Project;
}
