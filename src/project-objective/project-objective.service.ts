import { Injectable } from '@nestjs/common';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
import { ProjectObjectiveRepo } from './project-objective.repository';

import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class ProjectObjectiveService {
  constructor(
    private readonly projectObjectiveRepo: ProjectObjectiveRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createProjectObjectiveDto: CreateProjectObjectiveDto) {
    try {
      await this.projectObjectiveRepo.create(createProjectObjectiveDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.projectObjectiveRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const projectObjective = await this.projectObjectiveRepo.findOne(id);
    if (!projectObjective) throw this.errorHandler.notFound();
    return projectObjective;
  }

  async update(
    id: number,
    updateProjectObjectiveDto: UpdateProjectObjectiveDto,
  ) {
    const updatedObjective = await this.projectObjectiveRepo.update(
      id,
      updateProjectObjectiveDto,
    );
    if (updatedObjective.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedObjective = await this.projectObjectiveRepo.remove(+id);
    if (deletedObjective.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
