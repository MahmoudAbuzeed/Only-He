import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['parent', 'children', 'products'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findActive(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { is_active: true },
      relations: ['parent', 'children'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findRootCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { parent_id: null, is_active: true },
      relations: ['children'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findByParent(parentId: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { parent_id: parentId, is_active: true },
      relations: ['children'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products'],
    });
  }

  async findWithProducts(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete({ id });
  }

  async countProducts(categoryId: number): Promise<number> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    return category?.products?.length || 0;
  }

  async search(searchTerm: string): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('category.description ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('category.is_active = :isActive', { isActive: true })
      .orderBy('category.sort_order', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getMany();
  }

  // Additional methods for AdminCategoryService
  async findByName(name: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { name } });
  }

  async findOneWithDetails(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
  }

  async countChildren(parentId: number): Promise<number> {
    return await this.categoryRepository.count({ where: { parent_id: parentId } });
  }

  async countAllChildren(parentId: number): Promise<number> {
    // This is a simplified version - in a real app you'd use recursive CTE
    return await this.categoryRepository.count({ where: { parent_id: parentId } });
  }

  async isChildOf(childId: number, parentId: number): Promise<boolean> {
    const child = await this.categoryRepository.findOne({
      where: { id: childId },
      relations: ['parent'],
    });
    
    if (!child || !child.parent) return false;
    
    // Simple check - in a real app you'd check the entire hierarchy
    return child.parent.id === parentId;
  }

  async moveChildrenToParent(categoryId: number, newParentId: number | null): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ parent_id: newParentId })
      .where('parent_id = :categoryId', { categoryId })
      .execute();
  }

  async deactivateChildren(parentId: number): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ is_active: false })
      .where('parent_id = :parentId', { parentId })
      .execute();
  }

  async findAllWithHierarchy(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['parent', 'children'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  createQueryBuilder(alias: string) {
    return this.categoryRepository.createQueryBuilder(alias);
  }
}
