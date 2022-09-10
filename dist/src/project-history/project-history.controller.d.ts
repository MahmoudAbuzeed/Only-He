import { ProjectHistoryService } from './project-history.service';
import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';
export declare class ProjectHistoryController {
    private readonly projectHistoryService;
    constructor(projectHistoryService: ProjectHistoryService);
    create(createProjectHistoryDto: CreateProjectHistoryDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project-history.entity").ProjectHistory[]>;
    findOne(id: string): Promise<import("./entities/project-history.entity").ProjectHistory>;
    update(id: string, updateProjectHistoryDto: UpdateProjectHistoryDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
