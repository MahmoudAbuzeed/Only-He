import { Injectable } from '@nestjs/common';
import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';
import { TaskReferenceRepo } from './task-reference.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';
@Injectable()
export class TaskReferenceService {
  constructor(
    private readonly taskReferenceRepo: TaskReferenceRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createTaskReferenceDto: CreateTaskReferenceDto) {
    try {
      await this.taskReferenceRepo.create(createTaskReferenceDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.taskReferenceRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const taskRef = await this.taskReferenceRepo.findOne(id);
    if (!taskRef) throw this.errorHandler.notFound();
    return taskRef;
  }

  async update(id: number, updateTaskReferenceDto: UpdateTaskReferenceDto) {
    const updatedTaskRef = await this.taskReferenceRepo.update(
      id,
      updateTaskReferenceDto,
    );
    if (updatedTaskRef.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedAttachment = await this.taskReferenceRepo.remove(+id);
    if (deletedAttachment.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
