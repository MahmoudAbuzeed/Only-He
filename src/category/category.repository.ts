import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryRepo {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete({ id });
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOne({ where: { name } });
  }
}
