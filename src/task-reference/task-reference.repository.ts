import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';

import { TaskReference } from './entities/task-reference.entity';

@Injectable()
export class TaskReferenceRepo {
  constructor(
    @InjectRepository(TaskReference)
    private taskReferencesRepository: Repository<TaskReference>,
  ) {}

  async create(createTaskReferenceDto: CreateTaskReferenceDto) {
    return await this.taskReferencesRepository.save(createTaskReferenceDto);
  }

  async findAll() {
    return await this.taskReferencesRepository.find();
  }

  async findOne(id: number) {
    return await this.taskReferencesRepository.findOne(id);
  }

  async update(id: number, updateTaskReferenceDto: UpdateTaskReferenceDto) {
    return await this.taskReferencesRepository.update(
      id,
      updateTaskReferenceDto,
    );
  }

  async remove(id: number) {
    return await this.taskReferencesRepository.delete({ id });
  }
}
