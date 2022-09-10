import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepo } from './task.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';
import { Sector } from 'src/sector/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepo,
    private readonly errorHandler: ErrorHandler,
    private readonly sectorService: SectorService,
  ) {}

  async getSectors(sectors: any) {
    const sectorObjs: Sector[] = [];
    for (let index = 0; index < sectors.length; index++) {
      try {
        const sector = await this.sectorService.findOne(sectors[index]);
        sectorObjs.push(sector);
      } catch (error) {
        throw this.errorHandler.badRequest(error);
      }
    }
    return sectorObjs;
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      await this.taskRepo.create(createTaskDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.taskRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne(id);
    if (!task) throw this.errorHandler.notFound();
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.taskRepo.update(id, updateTaskDto);
    if (updatedTask.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async updateComponentSectors(id: number, updateTaskDto: UpdateTaskDto) {
    const sectors: any = await this.getSectors(updateTaskDto);
    const task = await this.findOne(id);
    task.sectors = sectors;
    const updatedTask: any = await this.taskRepo.updateTaskSectors(task);
    if (updatedTask.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async updateActivitiesSectors(tasks: any, sectors: any) {
    for (let index = 0; index < tasks.length; index++) {
      const task = await this.findOne(tasks[index].id);
      task.sectors = sectors;
      const updatedSector: any = await this.taskRepo.updateTaskSectors(task);
      if (updatedSector.affected == 0) throw this.errorHandler.notFound();
    }
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedTask = await this.taskRepo.remove(+id);
    if (deletedTask.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
