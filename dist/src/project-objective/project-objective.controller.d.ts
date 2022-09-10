import { ProjectObjectiveService } from './project-objective.service';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
export declare class ProjectObjectiveController {
    private readonly projectObjectiveService;
    constructor(projectObjectiveService: ProjectObjectiveService);
    create(createProjectObjectiveDto: CreateProjectObjectiveDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/project-objective.entity").ProjectObjective[]>;
    findOne(id: string): Promise<import("./entities/project-objective.entity").ProjectObjective>;
    update(id: string, updateProjectObjectiveDto: UpdateProjectObjectiveDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
