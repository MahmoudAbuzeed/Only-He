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

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      await this.categoryRepo.create(createCategoryDto);
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
    const category = await this.categoryRepo.findOne(id);
    if (!category) throw this.errorHandler.notFound();
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryRepo.update(id, updateCategoryDto);
    if (updatedCategory.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryRepo.remove(+id);
    if (deletedCategory.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
