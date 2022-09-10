import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';
import { SectorGoal } from './entities/sector-goal.entity';

@Injectable()
export class SectorGoalRepo {
  constructor(
    @InjectRepository(SectorGoal)
    private sectorGoalRepository: Repository<SectorGoal>,
  ) {}

  async create(createSectorGoalDto: CreateSectorGoalDto) {
    return await this.sectorGoalRepository.save(createSectorGoalDto);
  }

  async findAll() {
    return await this.sectorGoalRepository.find();
  }

  async findOne(id: number) {
    return await this.sectorGoalRepository.findOne(id);
  }

  async update(id: number, updateSectorGoalDto: UpdateSectorGoalDto) {
    return await this.sectorGoalRepository.update(id, updateSectorGoalDto);
  }

  async remove(id: number) {
    return await this.sectorGoalRepository.delete({ id });
  }
}
