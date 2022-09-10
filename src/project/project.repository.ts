import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Attachment } from 'src/attachment/entities/attachment.entity';
import { Finance } from 'src/finance/entities/finance.entity';

@Injectable()
export class ProjectRepo {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectRepository.save(createProjectDto);
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async findOne(id: number) {
    const components = await this.componentRepository.find({
      where: { project: id },
    });
    const attachments = await this.attachmentRepository.find({
      where: { project: id },
    });

    const finance = await this.financeRepository.find({
      where: { project: id },
    });

    const project: any = await this.projectRepository.findOne(id, {
      relations: ['sectors'],
    });
    project.components = components;
    project.attachments = attachments;
    project.finance = finance[0];
    return project;
  }

  async update(id: number, updateProjectDto: any) {
    return await this.projectRepository.update(id, updateProjectDto);
  }

  // to update relation many to many
  async save(id: number, updateProjectDto: any) {
    const project = await this.findOne(id);
    project.sectors = updateProjectDto;
    return await this.projectRepository.save(project);
  }

  async remove(id: number) {
    return await this.projectRepository.delete({ id });
  }
  async count() {
    return await this.projectRepository.count();
  }
  async loans() {
    return await this.projectRepository
      .createQueryBuilder('project')
      .select('SUM(project.budget)', 'sum')
      .where("project.type = 'loan' ")
      .getRawOne();
  }
  async grants() {
    return await this.projectRepository
      .createQueryBuilder('project')
      .select('SUM(project.budget)', 'sum')
      .where("project.type = 'grant' ")
      .getRawOne();
  }
}
