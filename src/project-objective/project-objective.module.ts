import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectObjectiveController } from './project-objective.controller';
import { ProjectObjective } from './entities/project-objective.entity';
import { ProjectObjectiveService } from './project-objective.service';
import { ProjectObjectiveRepo } from './project-objective.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectObjective])],
  controllers: [ProjectObjectiveController],
  providers: [ProjectObjectiveService, ProjectObjectiveRepo],
})
export class ProjectObjectiveModule {}
