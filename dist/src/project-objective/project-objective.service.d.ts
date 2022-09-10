import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
import { ProjectObjectiveRepo } from './project-objective.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class ProjectObjectiveService {
    private readonly projectObjectiveRepo;
    private readonly errorHandler;
    constructor(projectObjectiveRepo: ProjectObjectiveRepo, errorHandler: ErrorHandler);
    create(createProjectObjectiveDto: CreateProjectObjectiveDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project-objective.entity").ProjectObjective[]>;
    findOne(id: number): Promise<import("./entities/project-objective.entity").ProjectObjective>;
    update(id: number, updateProjectObjectiveDto: UpdateProjectObjectiveDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
