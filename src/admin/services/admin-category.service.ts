import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { ProductRepository } from '../../product/repositories/product.repository';
import { OrderItem } from '../../order/entities/order-item.entity';
import { ErrorHandler } from 'shared/errorHandler.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { CREATED_SUCCESSFULLY, UPDATED_SUCCESSFULLY, DELETED_SUCCESSFULLY } from 'messages';

@Injectable()
export class AdminCategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      // Check if category name already exists (either language)
      if (createCategoryDto.name_en) {
        const existingByEn = await this.categoryRepository.findByName(createCategoryDto.name_en);
        if (existingByEn) {
          throw this.errorHandler.badRequest({ message: 'Category name (EN) already exists' });
        }
      }
      if (createCategoryDto.name_ar) {
        const existingByAr = await this.categoryRepository.findByName(createCategoryDto.name_ar);
        if (existingByAr) {
          throw this.errorHandler.badRequest({ message: 'Category name (AR) already exists' });
        }
      }

      // Validate parent category if provided
      if (createCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne(createCategoryDto.parent_id);
        if (!parentCategory) {
          throw this.errorHandler.notFound({ message: 'Parent category not found' });
        }
      }

      const category = await this.categoryRepository.create(createCategoryDto);

      return {
        message: CREATED_SUCCESSFULLY,
        data: category,
      };
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.duplicateValue(error);
    }
  }

  async getAllCategories(filters: any) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        parent_id,
        is_active,
        include_products_count = true,
      } = filters;

      const skip = (page - 1) * limit;

      let queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.parent', 'parent')
        .leftJoinAndSelect('category.children', 'children')
        .leftJoinAndSelect('category.products', 'products');

      // Apply filters
      if (search) {
        queryBuilder = queryBuilder.where(
          '(category.name_en ILIKE :search OR category.name_ar ILIKE :search OR category.description_en ILIKE :search OR category.description_ar ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (parent_id !== undefined) {
        if (parent_id === null || parent_id === 'null') {
          queryBuilder = queryBuilder.andWhere('category.parent_id IS NULL');
        } else {
          queryBuilder = queryBuilder.andWhere('category.parent_id = :parentId', { parentId: parent_id });
        }
      }

      if (is_active !== undefined) {
        queryBuilder = queryBuilder.andWhere('category.is_active = :isActive', { 
          isActive: is_active === 'true' 
        });
      }

      // Get total count (without pagination)
      const totalQueryBuilder = queryBuilder.clone();
      const total = await totalQueryBuilder.getCount();

      // Apply pagination and get results
      const categories = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('category.created_at', 'DESC')
        .getMany();

      // If products count was requested, get it separately for each category
      let categoriesWithCount = categories;
      if (include_products_count) {
        categoriesWithCount = await Promise.all(
          categories.map(async (category) => {
            const productsCount = await this.productRepository.countByCategory(category.id);
            return {
              ...category,
              products_count: productsCount,
            };
          })
        );
      }

      return {
        categories: categoriesWithCount,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await this.categoryRepository.findOneWithDetails(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      // Get products count
      const productsCount = await this.productRepository.countByCategory(id);

      // Get subcategories count
      const subcategoriesCount = await this.categoryRepository.countChildren(id);

      return {
        ...category,
        products_count: productsCount,
        subcategories_count: subcategoriesCount,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      // Check if new name already exists (if name is being updated)
      if (updateCategoryDto.name_en && updateCategoryDto.name_en !== category.name_en) {
        const existingByEn = await this.categoryRepository.findByName(updateCategoryDto.name_en);
        if (existingByEn) {
          throw this.errorHandler.badRequest({ message: 'Category name (EN) already exists' });
        }
      }
      if (updateCategoryDto.name_ar && updateCategoryDto.name_ar !== category.name_ar) {
        const existingByAr = await this.categoryRepository.findByName(updateCategoryDto.name_ar);
        if (existingByAr) {
          throw this.errorHandler.badRequest({ message: 'Category name (AR) already exists' });
        }
      }

      // Validate parent category if provided
      if (updateCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne(updateCategoryDto.parent_id);
        if (!parentCategory) {
          throw this.errorHandler.notFound({ message: 'Parent category not found' });
        }

        // Prevent circular reference (category cannot be its own parent)
        if (updateCategoryDto.parent_id === id) {
          throw this.errorHandler.badRequest({ message: 'Category cannot be its own parent' });
        }

        // Prevent setting a child as parent (would create circular reference)
        const isChild = await this.categoryRepository.isChildOf(updateCategoryDto.parent_id, id);
        if (isChild) {
          throw this.errorHandler.badRequest({ 
            message: 'Cannot set a subcategory as parent (would create circular reference)' 
          });
        }
      }

      const result = await this.categoryRepository.update(id, updateCategoryDto);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async deleteCategory(id: number, forceDelete: boolean = false) {
    try {
      const category = await this.categoryRepository.findOneWithDetails(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      // Check if category has products
      const productsCount = await this.productRepository.countByCategory(id);
      if (productsCount > 0 && !forceDelete) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete category with ${productsCount} products. Use force delete or move products first.` 
        });
      }

      // Check if category has subcategories
      const subcategoriesCount = await this.categoryRepository.countChildren(id);
      if (subcategoriesCount > 0 && !forceDelete) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete category with ${subcategoriesCount} subcategories. Use force delete or move subcategories first.` 
        });
      }

      if (forceDelete) {
        // Move products to parent category or uncategorized
        if (productsCount > 0) {
          await this.productRepository.moveCategoryProducts(id, category.parent_id);
        }

        // Move subcategories to parent category
        if (subcategoriesCount > 0) {
          await this.categoryRepository.moveChildrenToParent(id, category.parent_id);
        }
      }

      const result = await this.categoryRepository.remove(id);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      return { 
        message: DELETED_SUCCESSFULLY,
        moved_products: forceDelete ? productsCount : 0,
        moved_subcategories: forceDelete ? subcategoriesCount : 0,
      };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async toggleCategoryStatus(id: number) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      const newStatus = !category.is_active;
      await this.categoryRepository.update(id, { is_active: newStatus });

      // If deactivating, also deactivate all subcategories
      if (!newStatus) {
        await this.categoryRepository.deactivateChildren(id);
      }

      return {
        message: 'Category status updated successfully',
        is_active: newStatus,
        affected_subcategories: !newStatus ? await this.categoryRepository.countAllChildren(id) : 0,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getCategoryTree() {
    try {
      const categories = await this.categoryRepository.findAllWithHierarchy();
      
      // Build tree structure
      const categoryMap = new Map();
      const rootCategories = [];

      // First pass: create map of all categories
      categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
      });

      // Second pass: build tree structure
      categories.forEach(category => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children.push(categoryMap.get(category.id));
          }
        } else {
          rootCategories.push(categoryMap.get(category.id));
        }
      });

      return { categories: rootCategories };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async moveCategory(id: number, newParentId: number | null) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      // Validate new parent if provided
      if (newParentId) {
        const newParent = await this.categoryRepository.findOne(newParentId);
        if (!newParent) {
          throw this.errorHandler.notFound({ message: 'New parent category not found' });
        }

        // Prevent circular reference
        if (newParentId === id) {
          throw this.errorHandler.badRequest({ message: 'Category cannot be its own parent' });
        }

        const isChild = await this.categoryRepository.isChildOf(newParentId, id);
        if (isChild) {
          throw this.errorHandler.badRequest({ 
            message: 'Cannot move category to its own subcategory (would create circular reference)' 
          });
        }
      }

      await this.categoryRepository.update(id, { parent_id: newParentId });

      return {
        message: 'Category moved successfully',
        category_id: id,
        new_parent_id: newParentId,
      };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getCategoryAnalytics(id: number) {
    try {
      const category = await this.categoryRepository.findOne(id);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      const [
        productsCount,
        subcategoriesCount,
        activeProductsCount,
        totalProductsValue,
      ] = await Promise.all([
        this.productRepository.countByCategory(id),
        this.categoryRepository.countChildren(id),
        this.productRepository.countActiveByCategoryId(id),
        this.productRepository.getTotalValueByCategory(id),
      ]);

      // Get real sales analytics for this category
      const [
        salesData,
        topSellingProducts,
      ] = await Promise.all([
        this.orderItemRepository
          .createQueryBuilder('orderItem')
          .leftJoin('orderItem.product', 'product')
          .leftJoin('orderItem.order', 'order')
          .select('COUNT(DISTINCT order.id)', 'total_orders')
          .addSelect('SUM(orderItem.total_price)', 'total_revenue')
          .where('product.category_id = :categoryId', { categoryId: id })
          .getRawOne(),
        this.orderItemRepository
          .createQueryBuilder('orderItem')
          .leftJoin('orderItem.product', 'product')
          .select('product.id', 'product_id')
          .addSelect('product.name_en', 'product_name')
          .addSelect('SUM(orderItem.quantity)', 'quantity_sold')
          .addSelect('SUM(orderItem.total_price)', 'revenue')
          .where('product.category_id = :categoryId', { categoryId: id })
          .groupBy('product.id, product.name_en')
          .orderBy('SUM(orderItem.quantity)', 'DESC')
          .limit(5)
          .getRawMany(),
      ]);

      const totalOrders = parseInt(salesData.total_orders) || 0;
      const totalRevenue = parseFloat(salesData.total_revenue) || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const salesAnalytics = {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        top_selling_products: topSellingProducts.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity_sold: parseInt(item.quantity_sold),
          revenue: parseFloat(item.revenue),
        })),
      };

      return {
        category: {
          id: category.id,
          name_en: category.name_en,
          name_ar: category.name_ar,
        },
        products: {
          total: productsCount,
          active: activeProductsCount,
          inactive: productsCount - activeProductsCount,
          total_value: totalProductsValue,
        },
        subcategories: {
          total: subcategoriesCount,
        },
        sales: salesAnalytics,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async bulkUpdateCategories(updates: { id: number; is_active?: boolean; parent_id?: number }[]) {
    try {
      let updatedCount = 0;

      for (const update of updates) {
        const category = await this.categoryRepository.findOne(update.id);
        if (category) {
          const updateData: any = {};
          
          if (update.is_active !== undefined) {
            updateData.is_active = update.is_active;
          }
          
          if (update.parent_id !== undefined) {
            // Validate parent if provided
            if (update.parent_id && update.parent_id !== update.id) {
              const parent = await this.categoryRepository.findOne(update.parent_id);
              if (parent) {
                updateData.parent_id = update.parent_id;
              }
            } else if (update.parent_id === null) {
              updateData.parent_id = null;
            }
          }

          if (Object.keys(updateData).length > 0) {
            await this.categoryRepository.update(update.id, updateData);
            updatedCount++;
          }
        }
      }

      return {
        message: 'Categories updated successfully',
        updated_count: updatedCount,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async exportCategoriesCSV() {
    try {
      const categories = await this.categoryRepository.findAllWithHierarchy();

      // Generate CSV content
      const headers = 'ID,Name (EN),Name (AR),Description (EN),Description (AR),Parent Category,Is Active,Products Count,Created Date\n';
      const rows = await Promise.all(
        categories.map(async (category) => {
          const productsCount = await this.productRepository.countByCategory(category.id);
          const parentName = category.parent ? (category.parent.name_en || category.parent.name_ar || 'Root') : 'Root';

          return `${category.id},"${category.name_en || ''}","${category.name_ar || ''}","${category.description_en || ''}","${category.description_ar || ''}","${parentName}",${category.is_active},${productsCount},${category.created_at}`;
        })
      );

      const csvContent = headers + rows.join('\n');

      return {
        content: csvContent,
        filename: `categories_export_${new Date().toISOString().split('T')[0]}.csv`,
        contentType: 'text/csv',
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }
}
