import { Injectable } from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorRepo } from './sector.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class SectorService {
  constructor(
    private readonly sectorRepo: SectorRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createSectorDto: CreateSectorDto) {
    try {
      await this.sectorRepo.create(createSectorDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.sectorRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const sector = await this.sectorRepo.findOne(id);
    if (!sector) throw this.errorHandler.notFound();
    return sector;
  }

  async update(id: number, updateSectorDto: UpdateSectorDto) {
    const updatedSector = await this.sectorRepo.update(id, updateSectorDto);
    if (updatedSector.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedSector = await this.sectorRepo.remove(+id);
    if (deletedSector.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }

  async findAllProjects(sectorId: number) {
    try {
      const sectors = (await this.sectorRepo.findAllProjects(sectorId)) as any;
      const result = sectors.map((sector) => sector.projects);
      return result.flat();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }
}
