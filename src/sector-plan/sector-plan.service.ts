import { Injectable } from '@nestjs/common';
import { CreateSectorPlanDto } from './dto/create-sector-plan.dto';
import { UpdateSectorPlanDto } from './dto/update-sector-plan.dto';
import { SectorPlanRepo } from './sector-plan.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class SectorPlanService {
  constructor(
    private readonly sectorPlanRepo: SectorPlanRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createSectorPlanDto: CreateSectorPlanDto) {
    try {
      await this.sectorPlanRepo.create(createSectorPlanDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.sectorPlanRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const sectorPlan = await this.sectorPlanRepo.findOne(id);
    if (!sectorPlan) throw this.errorHandler.notFound();
    return sectorPlan;
  }

  async update(id: number, updateSectorPlanDto: UpdateSectorPlanDto) {
    const updatedPlan = await this.sectorPlanRepo.update(
      id,
      updateSectorPlanDto,
    );
    if (updatedPlan.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedPlane = await this.sectorPlanRepo.remove(+id);
    if (deletedPlane.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
