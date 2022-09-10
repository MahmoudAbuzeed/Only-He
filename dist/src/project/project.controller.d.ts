/// <reference types="multer" />
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project.entity").Project[]>;
    count(): Promise<number>;
    loans(): Promise<any>;
    grants(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        message: string;
    }>;
    updateSectors(id: string, updateProjectDto: any): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    uploadFile(files: Array<Express.Multer.File>): Promise<any>;
}
