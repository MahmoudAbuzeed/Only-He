import { Injectable } from '@nestjs/common';
import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';
import { ProjectHistoryRepo } from './project-history.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class ProjectHistoryService {
  constructor(
    private readonly projectHistoryRepo: ProjectHistoryRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createProjectHistoryDto: CreateProjectHistoryDto) {
    try {
      await this.projectHistoryRepo.create(createProjectHistoryDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.projectHistoryRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const project = await this.projectHistoryRepo.findOne(id);
    if (!project) throw this.errorHandler.notFound();
    return project;
  }

  async update(id: number, updateProjectHistoryDto: UpdateProjectHistoryDto) {
    const updatedProjectHistory = await this.projectHistoryRepo.update(
      id,
      updateProjectHistoryDto,
    );
    if (updatedProjectHistory.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedProjectHistory = await this.projectHistoryRepo.remove(+id);
    if (deletedProjectHistory.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
