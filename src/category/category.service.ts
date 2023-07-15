import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepo } from './category.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createRoleDto: CreateCategoryDto) {
    try {
      await this.categoryRepo.create(createRoleDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.categoryRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const role = await this.categoryRepo.findOne(id);
    if (!role) throw this.errorHandler.notFound();
    return role;
  }

  async update(id: number, updateRoleDto: UpdateCategoryDto) {
    const updatedRole = await this.categoryRepo.update(id, updateRoleDto);
    if (updatedRole.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedRole = await this.categoryRepo.remove(+id);
    if (deletedRole.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
