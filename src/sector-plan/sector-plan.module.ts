import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SectorPlanService } from './sector-plan.service';
import { SectorPlanController } from './sector-plan.controller';
import { SectorPlan } from './entities/sector-plan.entity';
import { SectorPlanRepo } from './sector-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SectorPlan])],

  controllers: [SectorPlanController],
  providers: [SectorPlanService, SectorPlanRepo],
})
export class SectorPlanModule {}
