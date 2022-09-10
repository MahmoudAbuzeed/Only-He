import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
import { ProjectObjective } from './entities/project-objective.entity';

@Injectable()
export class ProjectObjectiveRepo {
  constructor(
    @InjectRepository(ProjectObjective)
    private projectObjectiveRepository: Repository<ProjectObjective>,
  ) {}

  async create(createProjectObjectiveDto: CreateProjectObjectiveDto) {
    return await this.projectObjectiveRepository.save(
      createProjectObjectiveDto,
    );
  }

  async findAll() {
    return await this.projectObjectiveRepository.find();
  }

  async findOne(id: number) {
    return await this.projectObjectiveRepository.findOne(id);
  }

  async update(
    id: number,
    updateProjectObjectiveDto: UpdateProjectObjectiveDto,
  ) {
    return await this.projectObjectiveRepository.update(
      id,
      updateProjectObjectiveDto,
    );
  }

  async remove(id: number) {
    return await this.projectObjectiveRepository.delete({ id });
  }
}
