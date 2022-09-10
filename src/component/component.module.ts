import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { Component } from './entities/component.entity';
import { ComponentRepo } from './component.repository';
import { Task } from '../task/entities/task.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';
import { SectorRepo } from 'src/sector/sector.repository';
import { TaskService } from 'src/task/task.service';
import { TaskRepo } from 'src/task/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Component, Task, Sector])],
  controllers: [ComponentController],
  providers: [
    ComponentService,
    ComponentRepo,
    SectorService,
    SectorRepo,
    TaskService,
    TaskRepo,
  ],
})
export class ComponentModule {}
