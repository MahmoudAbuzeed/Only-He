import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Validate parent category exists if parent_id is provided
      if (createCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne(createCategoryDto.parent_id);
        if (!parentCategory) {
          throw this.errorHandler.badRequest({ message: 'Parent category not found' });
        }
      }

      const category = await this.categoryRepository.create(createCategoryDto);
      return { message: CREATED_SUCCESSFULLY, data: category };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.findAll();
      return categories;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findActive() {
    try {
      const categories = await this.categoryRepository.findActive();
      return categories;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findRootCategories() {
    try {
      const categories = await this.categoryRepository.findRootCategories();
      return categories;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findByParent(parentId: number) {
    try {
      const categories = await this.categoryRepository.findByParent(parentId);
      return categories;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound();
      }
      return category;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findWithProducts(id: number) {
    try {
      const category = await this.categoryRepository.findWithProducts(id);
      if (!category) {
        throw this.errorHandler.notFound();
      }
      return category;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      // Check if category exists
      const existingCategory = await this.categoryRepository.findOne(id);
      if (!existingCategory) {
        throw this.errorHandler.notFound();
      }

      // Validate parent category exists if parent_id is being updated
      if (updateCategoryDto.parent_id) {
        if (updateCategoryDto.parent_id === id) {
          throw this.errorHandler.badRequest({ message: 'Category cannot be its own parent' });
        }
        
        const parentCategory = await this.categoryRepository.findOne(updateCategoryDto.parent_id);
        if (!parentCategory) {
          throw this.errorHandler.badRequest({ message: 'Parent category not found' });
        }
      }

      const updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);
      if (updatedCategory.affected === 0) {
        throw this.errorHandler.notFound();
      }
      
      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async remove(id: number) {
    try {
      // Check if category exists
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound();
      }

      // Check if category has products
      const productCount = await this.categoryRepository.countProducts(id);
      if (productCount > 0) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete category with ${productCount} products. Please move or delete products first.` 
        });
      }

      // Check if category has child categories
      if (category.children && category.children.length > 0) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete category with ${category.children.length} subcategories. Please move or delete subcategories first.` 
        });
      }

      const deletedCategory = await this.categoryRepository.remove(id);
      if (deletedCategory.affected === 0) {
        throw this.errorHandler.notFound();
      }
      
      return { message: DELETED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async search(searchTerm: string) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw this.errorHandler.badRequest({ message: 'Search term must be at least 2 characters long' });
      }
      
      const categories = await this.categoryRepository.search(searchTerm.trim());
      return categories;
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }
}
