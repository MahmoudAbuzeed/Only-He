import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateSectorPlanDto } from './dto/create-sector-plan.dto';
import { UpdateSectorPlanDto } from './dto/update-sector-plan.dto';
import { SectorPlan } from './entities/sector-plan.entity';

@Injectable()
export class SectorPlanRepo {
  constructor(
    @InjectRepository(SectorPlan)
    private sectorPlanRepository: Repository<SectorPlan>,
  ) {}

  async create(createSectorPlantDto: CreateSectorPlanDto) {
    return await this.sectorPlanRepository.save(createSectorPlantDto);
  }

  async findAll() {
    return await this.sectorPlanRepository.find();
  }

  async findOne(id: number) {
    return await this.sectorPlanRepository.findOne(id);
  }

  async update(id: number, updateSectorPlanDto: UpdateSectorPlanDto) {
    return await this.sectorPlanRepository.update(id, updateSectorPlanDto);
  }

  async remove(id: number) {
    return await this.sectorPlanRepository.delete({ id });
  }
}
