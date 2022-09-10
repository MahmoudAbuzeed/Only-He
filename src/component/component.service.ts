import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentRepo } from './component.repository';
import {
  CREATED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
} from 'messages';
import { ErrorHandler } from 'shared/errorHandler.service';

import { SectorService } from 'src/sector/sector.service';

import { Sector } from 'src/sector/entities/sector.entity';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class ComponentService {
  constructor(
    private readonly componentRepo: ComponentRepo,
    private readonly errorHandler: ErrorHandler,
    private readonly sectorService: SectorService,
    private readonly taskService: TaskService,
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

  async create(createComponentDto: CreateComponentDto) {
    try {
      await this.componentRepo.create(createComponentDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.componentRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const component = await this.componentRepo.findOne(id);
    if (!component) throw this.errorHandler.notFound();
    return component;
  }

  async update(id: number, updateComponentDto: UpdateComponentDto) {
    const updatedComponent = await this.componentRepo.update(
      id,
      updateComponentDto,
    );
    if (updatedComponent.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async updateComponentSectors(
    id: number,
    updateComponentDto: UpdateComponentDto,
  ) {
    const sectors: any = await this.getSectors(updateComponentDto);
    const component = await this.findOne(id);
    component.sectors = sectors;
    const updatedComponent: any =
      await this.componentRepo.updateComponentSectors(component);
    this.taskService.updateActivitiesSectors(
      updatedComponent.activities,
      updatedComponent.sectors,
    );

    if (updatedComponent.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async updateComponentsSectors(components: any, sectors: any) {
    for (let index = 0; index < components.length; index++) {
      const component = await this.findOne(components[index].id);
      component.sectors = sectors;
      const updatedComponent: any =
        await this.componentRepo.updateComponentSectors(component);
      this.taskService.updateActivitiesSectors(
        updatedComponent.activities,
        updatedComponent.sectors,
      );
      if (updatedComponent.affected == 0) throw this.errorHandler.notFound();
    }
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedComponent = await this.componentRepo.remove(+id);
    if (deletedComponent.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
