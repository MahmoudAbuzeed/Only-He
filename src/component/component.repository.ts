import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from './entities/component.entity';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class ComponentRepo {
  constructor(
    @InjectRepository(Component)
    private component: Repository<Component>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createComponentDto: CreateComponentDto) {
    return await this.component.save(createComponentDto);
  }

  async findAll() {
    return await this.component.find();
  }

  async findOne(id: number) {
    const activities = await this.taskRepository.find({
      where: { component: id },
    });
    const component: any = await this.component.findOne(id, {
      relations: ['sectors'],
    });
    component.activities = activities;
    return component;
  }

  async update(id: number, updateComponentDto: UpdateComponentDto) {
    return await this.component.update(id, updateComponentDto);
  }

  async updateComponentSectors(updateComponentDto: UpdateComponentDto) {
    return await this.component.save(updateComponentDto);
  }

  async remove(id: number) {
    return await this.component.delete({ id });
  }
}
