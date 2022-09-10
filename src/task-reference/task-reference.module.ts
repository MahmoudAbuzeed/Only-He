import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskReferenceService } from './task-reference.service';
import { TaskReferenceController } from './task-reference.controller';
import { TaskReference } from './entities/task-reference.entity';

import { TaskReferenceRepo } from './task-reference.repository';
@Module({
  imports: [TypeOrmModule.forFeature([TaskReference])],

  controllers: [TaskReferenceController],
  providers: [TaskReferenceService, TaskReferenceRepo],
})
export class TaskReferenceModule {}
