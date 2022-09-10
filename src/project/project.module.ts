import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './entities/project.entity';
import { Component } from '../component/entities/component.entity';
import { Task } from '../task/entities/task.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepo } from './project.repository';
import { ComponentService } from '../component/component.service';
import { ComponentRepo } from '../component/component.repository';
import { TaskService } from '../task/task.service';
import { TaskRepo } from '../task/task.repository';
import { Attachment } from 'src/attachment/entities/attachment.entity';
import { AttachmentService } from 'src/attachment/attachment.service';
import { AttachmentRepo } from 'src/attachment/attachment.repository';
import { ProjectHistoryService } from 'src/project-history/project-history.service';
import { ProjectHistory } from 'src/project-history/entities/project-history.entity';
import { ProjectHistoryRepo } from 'src/project-history/project-history.repository';

import { FinanceService } from 'src/finance/finance.service';
import { Finance } from 'src/finance/entities/finance.entity';
import { FinanceRepo } from 'src/finance/finance.repository';
import { SectorService } from 'src/sector/sector.service';
import { SectorRepo } from 'src/sector/sector.repository';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
import { StackHolderRepo } from 'src/stack-holder/stack-holder.repository';
import { StackHolderService } from 'src/stack-holder/stack-holder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Component,
      Task,
      Attachment,
      ProjectHistory,
      Finance,
      Sector,
      StackHolder,
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepo,
    ComponentService,
    ComponentRepo,
    TaskService,
    TaskRepo,
    AttachmentService,
    AttachmentRepo,
    ProjectHistoryService,
    ProjectHistoryRepo,
    FinanceRepo,
    FinanceService,
    SectorService,
    SectorRepo,
    StackHolderRepo,
    StackHolderService,
  ],
})
export class ProjectModule {}
