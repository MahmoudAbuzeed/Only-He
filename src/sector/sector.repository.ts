import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Sector } from './entities/sector.entity';

@Injectable()
export class SectorRepo {
  constructor(
    @InjectRepository(Sector)
    private sectorRepository: Repository<Sector>,
  ) {}

  async create(createSectorDto: CreateSectorDto) {
    return await this.sectorRepository.save(createSectorDto);
  }

  async findAll() {
    return await this.sectorRepository.find();
  }

  async findOne(id: number) {
    return await this.sectorRepository.findOne(id);
  }

  async update(id: number, updateSectorDto: UpdateSectorDto) {
    return await this.sectorRepository.update(id, updateSectorDto);
  }

  async remove(id: number) {
    return await this.sectorRepository.delete({ id });
  }

  async findAllProjects(sectorId: number) {
    return await this.sectorRepository.find({
      relations: ['projects'],
      where: { id: sectorId },
    });
  }
}
