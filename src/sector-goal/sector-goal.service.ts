import { Injectable } from '@nestjs/common';
import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';
import { SectorGoalRepo } from './sector-goal.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';
@Injectable()
export class SectorGoalService {
  constructor(
    private readonly sectorGoalRepo: SectorGoalRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createSectorGoalDto: CreateSectorGoalDto) {
    try {
      await this.sectorGoalRepo.create(createSectorGoalDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.sectorGoalRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const sectorGoal = await this.sectorGoalRepo.findOne(id);
    if (!sectorGoal) throw this.errorHandler.notFound();
    return sectorGoal;
  }

  async update(id: number, updateSectorGoalDto: UpdateSectorGoalDto) {
    const updatedGoal = await this.sectorGoalRepo.update(
      id,
      updateSectorGoalDto,
    );
    if (updatedGoal.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedGoal = await this.sectorGoalRepo.remove(+id);
    if (deletedGoal.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
