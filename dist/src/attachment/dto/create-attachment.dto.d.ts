import { Project } from 'src/project/entities/project.entity';
export declare class CreateAttachmentDto {
    name: string;
    avatar_fd: string;
    size: number;
    storage_type: string;
    project: Project;
}
