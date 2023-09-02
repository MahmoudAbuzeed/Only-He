import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryRepo } from "./category.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo, private readonly errorHandler: ErrorHandler) {}

  async create(createCategoryDto: CreateCategoryDto) {
    await this.checkIfCategoryExists(createCategoryDto.name);
    return await this.categoryRepo.create(createCategoryDto);
  }

  private async checkIfCategoryExists(name: string) {
    const existingSpecialOffer = await this.categoryRepo.findByName(name);
    if (existingSpecialOffer) {
      throw new CustomError(400, "Category already exists!");
    }
  }

  async findAll() {
    return await this.categoryRepo.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne(id);
    if (!category) throw new CustomError(401, "Category Not Found!");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryRepo.update(id, updateCategoryDto);
    if (updatedCategory.affected == 0) throw new CustomError(401, "Category Not Found!");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryRepo.remove(+id);
    if (deletedCategory.affected == 0) throw new CustomError(401, "Category Not Found!");
    return { message: DELETED_SUCCESSFULLY };
  }
}
