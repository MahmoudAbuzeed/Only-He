import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectHistoryService } from './project-history.service';
import { ProjectHistoryController } from './project-history.controller';
import { ProjectHistory } from './entities/project-history.entity';
import { ProjectHistoryRepo } from './project-history.repository';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectHistory])],
  controllers: [ProjectHistoryController],
  providers: [ProjectHistoryService, ProjectHistoryRepo],
})
export class ProjectHistoryModule {}
