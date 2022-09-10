import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';
import { ProjectHistoryRepo } from './project-history.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class ProjectHistoryService {
    private readonly projectHistoryRepo;
    private readonly errorHandler;
    constructor(projectHistoryRepo: ProjectHistoryRepo, errorHandler: ErrorHandler);
    create(createProjectHistoryDto: CreateProjectHistoryDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project-history.entity").ProjectHistory[]>;
    findOne(id: number): Promise<import("./entities/project-history.entity").ProjectHistory>;
    update(id: number, updateProjectHistoryDto: UpdateProjectHistoryDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
