import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';

import { TaskRepo } from './task.repository';
import { Sector } from 'src/sector/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';
import { SectorRepo } from 'src/sector/sector.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Sector])],

  controllers: [TaskController],
  providers: [TaskService, TaskRepo, SectorService, SectorRepo],
})
export class TaskModule {}
