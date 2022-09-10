import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Attachment } from 'src/attachment/entities/attachment.entity';
import { Finance } from 'src/finance/entities/finance.entity';
export declare class ProjectRepo {
    private projectRepository;
    private componentRepository;
    private attachmentRepository;
    private financeRepository;
    constructor(projectRepository: Repository<Project>, componentRepository: Repository<Component>, attachmentRepository: Repository<Attachment>, financeRepository: Repository<Finance>);
    create(createProjectDto: CreateProjectDto): Promise<CreateProjectDto & Project>;
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateProjectDto: any): Promise<import("typeorm").UpdateResult>;
    save(id: number, updateProjectDto: any): Promise<any>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    count(): Promise<number>;
    loans(): Promise<any>;
    grants(): Promise<any>;
}
