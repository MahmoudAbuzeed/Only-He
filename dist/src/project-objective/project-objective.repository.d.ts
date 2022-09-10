import { Repository } from 'typeorm';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
import { ProjectObjective } from './entities/project-objective.entity';
export declare class ProjectObjectiveRepo {
    private projectObjectiveRepository;
    constructor(projectObjectiveRepository: Repository<ProjectObjective>);
    create(createProjectObjectiveDto: CreateProjectObjectiveDto): Promise<CreateProjectObjectiveDto & ProjectObjective>;
    findAll(): Promise<ProjectObjective[]>;
    findOne(id: number): Promise<ProjectObjective>;
    update(id: number, updateProjectObjectiveDto: UpdateProjectObjectiveDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
