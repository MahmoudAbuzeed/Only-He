import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepo } from './department.repository';
import { ErrorHandler } from 'shared/errorHandler.service';

import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepo: DepartmentRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      await this.departmentRepo.create(createDepartmentDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.departmentRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const department = await this.departmentRepo.findOne(id);
    if (!department) throw this.errorHandler.notFound();
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const updatedDepartment = await this.departmentRepo.update(
      id,
      updateDepartmentDto,
    );
    if (updatedDepartment.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedDepartment = await this.departmentRepo.remove(+id);
    if (deletedDepartment.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
