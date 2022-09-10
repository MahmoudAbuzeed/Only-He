import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';

import { ProjectHistory } from './entities/project-history.entity';

@Injectable()
export class ProjectHistoryRepo {
  constructor(
    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,
  ) {}

  async create(createProjectHistoryDto: CreateProjectHistoryDto) {
    return await this.projectHistoryRepository.save(createProjectHistoryDto);
  }

  async findAll() {
    return await this.projectHistoryRepository.find();
  }

  async findOne(id: number) {
    return await this.projectHistoryRepository.findOne(id);
  }

  async update(id: number, updateProjectHistoryDto: UpdateProjectHistoryDto) {
    return await this.projectHistoryRepository.update(
      id,
      updateProjectHistoryDto,
    );
  }

  async remove(id: number) {
    return await this.projectHistoryRepository.delete({ id });
  }
}
