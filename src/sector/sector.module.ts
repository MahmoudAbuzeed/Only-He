import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { Sector } from './entities/sector.entity';

import { SectorRepo } from './sector.repository';
@Module({
  imports: [TypeOrmModule.forFeature([Sector])],

  controllers: [SectorController],
  providers: [SectorService, SectorRepo],
})
export class SectorModule {}
