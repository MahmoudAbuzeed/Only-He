import { Repository } from 'typeorm';
import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';
import { ProjectHistory } from './entities/project-history.entity';
export declare class ProjectHistoryRepo {
    private projectHistoryRepository;
    constructor(projectHistoryRepository: Repository<ProjectHistory>);
    create(createProjectHistoryDto: CreateProjectHistoryDto): Promise<CreateProjectHistoryDto & ProjectHistory>;
    findAll(): Promise<ProjectHistory[]>;
    findOne(id: number): Promise<ProjectHistory>;
    update(id: number, updateProjectHistoryDto: UpdateProjectHistoryDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
