import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../../product/product.service';
import { ProductRepository } from '../../product/repositories/product.repository';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { OrderItem } from '../../order/entities/order-item.entity';
import { FavoriteRepository } from '../../favorite/repositories/favorite.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { UpdateProductDto } from '../../product/dto/update-product.dto';
import { ProductStatus } from '../../product/entities/product.entity';
import { CREATED_SUCCESSFULLY, UPDATED_SUCCESSFULLY, DELETED_SUCCESSFULLY } from 'messages';

@Injectable()
export class AdminProductService {
  constructor(
    private readonly productService: ProductService,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      // Validate category exists
      if (createProductDto.category_id) {
        const category = await this.categoryRepository.findOne(createProductDto.category_id);
        if (!category) {
          throw this.errorHandler.notFound({ message: 'Category not found' });
        }
      }

      // Generate SKU if not provided
      if (!createProductDto.sku) {
        createProductDto.sku = await this.generateSKU(createProductDto.name);
      }

      // Validate SKU uniqueness
      const existingProduct = await this.productRepository.findBySKU(createProductDto.sku);
      if (existingProduct) {
        throw this.errorHandler.badRequest({ message: 'SKU already exists' });
      }

      const product = await this.productRepository.create(createProductDto);

      return {
        message: CREATED_SUCCESSFULLY,
        data: product,
      };
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.duplicateValue(error);
    }
  }

  async getAllProducts(filters: any) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category_id,
        status,
        min_price,
        max_price,
        low_stock,
        sort_by = 'created_at',
        sort_order = 'DESC',
      } = filters;

      const skip = (page - 1) * limit;

      let queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .select([
          'product.id',
          'product.name',
          'product.sku',
          'product.price',
          'product.cost_price',
          'product.stock_quantity',
          'product.min_stock_level',
          'product.status',
          'product.manage_stock',
          'product.created_at',
          'product.updated_at',
          'category.id',
          'category.name',
        ]);

      // Apply filters
      if (search) {
        queryBuilder = queryBuilder.where(
          '(product.name ILIKE :search OR product.sku ILIKE :search OR product.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (category_id) {
        queryBuilder = queryBuilder.andWhere('product.category_id = :categoryId', { categoryId: category_id });
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('product.status = :status', { status });
      }

      if (min_price) {
        queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice: min_price });
      }

      if (max_price) {
        queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: max_price });
      }

      if (low_stock === 'true') {
        queryBuilder = queryBuilder.andWhere('product.manage_stock = true')
          .andWhere('product.stock_quantity <= product.min_stock_level');
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply sorting and pagination
      const validSortFields = ['name', 'price', 'stock_quantity', 'created_at', 'updated_at'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
      const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const products = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy(`product.${sortField}`, sortDirection)
        .getMany();

      // Add stock status to each product
      const productsWithStatus = products.map(product => ({
        ...product,
        stock_status: this.getStockStatus(product),
        profit_margin: this.calculateProfitMargin(product.price, product.cost_price),
      }));

      return {
        products: productsWithStatus,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.productRepository.findOneWithDetails(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // Get real sales statistics
      const salesData = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .select('SUM(orderItem.quantity)', 'total_sold')
        .addSelect('SUM(orderItem.total_price)', 'revenue_generated')
        .where('orderItem.product_id = :productId', { productId: id })
        .getRawOne();

      // Add calculated fields
      const productWithExtras = {
        ...product,
        stock_status: this.getStockStatus(product),
        profit_margin: this.calculateProfitMargin(product.price, product.cost_price),
        total_sold: parseInt(salesData.total_sold) || 0,
        revenue_generated: parseFloat(salesData.revenue_generated) || 0,
      };

      return productWithExtras;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // Validate category exists if provided
      if (updateProductDto.category_id) {
        const category = await this.categoryRepository.findOne(updateProductDto.category_id);
        if (!category) {
          throw this.errorHandler.notFound({ message: 'Category not found' });
        }
      }

      // Validate SKU uniqueness if provided
      if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
        const existingProduct = await this.productRepository.findBySKU(updateProductDto.sku);
        if (existingProduct) {
          throw this.errorHandler.badRequest({ message: 'SKU already exists' });
        }
      }

      const result = await this.productRepository.update(id, updateProductDto);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async deleteProduct(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // TODO: Check if product has orders, you might want to prevent deletion
      // For now, we'll allow deletion

      const result = await this.productRepository.remove(id);
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      return { message: DELETED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async bulkUpdateStatus(productIds: number[], status: ProductStatus) {
    try {
      const result = await this.productRepository.bulkUpdateStatus(productIds, status);
      
      return {
        message: 'Products status updated successfully',
        updated_count: result.affected,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async bulkUpdatePrices(updates: { id: number; price: number; cost_price?: number }[]) {
    try {
      let updatedCount = 0;

      for (const update of updates) {
        const product = await this.productRepository.findOne(update.id);
        if (product) {
          await this.productRepository.update(update.id, {
            price: update.price,
            cost_price: update.cost_price || product.cost_price,
          });
          updatedCount++;
        }
      }

      return {
        message: 'Product prices updated successfully',
        updated_count: updatedCount,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async adjustStock(id: number, quantity: number, reason: string) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      if (!product.manage_stock) {
        throw this.errorHandler.badRequest({ message: 'Stock management is not enabled for this product' });
      }

      const newQuantity = product.stock_quantity + quantity;
      if (newQuantity < 0) {
        throw this.errorHandler.badRequest({ message: 'Insufficient stock quantity' });
      }

      await this.productRepository.update(id, { stock_quantity: newQuantity });

      // TODO: Log stock adjustment in inventory log table
      console.log(`Stock adjusted for product ${product.sku}: ${quantity} (${reason})`);

      return {
        message: 'Stock adjusted successfully',
        previous_quantity: product.stock_quantity,
        new_quantity: newQuantity,
        adjustment: quantity,
        reason,
      };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getProductAnalytics(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // Get real product analytics from database
      const [
        salesData,
        favoritesCount,
      ] = await Promise.all([
        this.orderItemRepository
          .createQueryBuilder('orderItem')
          .select('SUM(orderItem.quantity)', 'total_sold')
          .addSelect('SUM(orderItem.total_price)', 'revenue_generated')
          .where('orderItem.product_id = :productId', { productId: id })
          .getRawOne(),
        this.favoriteRepository
          .createQueryBuilder('favorite')
          .where('favorite.product_id = :productId', { productId: id })
          .getCount(),
      ]);

      const totalSold = parseInt(salesData.total_sold) || 0;
      const revenueGenerated = parseFloat(salesData.revenue_generated) || 0;
      const profitGenerated = product.cost_price 
        ? (revenueGenerated - (product.cost_price * totalSold))
        : 0;

      const analytics = {
        total_sold: totalSold,
        revenue_generated: revenueGenerated,
        profit_generated: profitGenerated,
        average_rating: 0, // Would need a reviews table to implement
        total_reviews: 0, // Would need a reviews table to implement
        conversion_rate: 0, // Would need view tracking to implement
        views: 0, // Would need view tracking to implement
        cart_additions: 0, // Would need cart analytics to implement
        favorites_count: favoritesCount,
      };

      return {
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
        },
        analytics,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getLowStockProducts(threshold?: number) {
    try {
      let queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .where('product.manage_stock = :manageStock', { manageStock: true })
        .andWhere('product.status = :status', { status: ProductStatus.ACTIVE });

      if (threshold) {
        queryBuilder = queryBuilder.andWhere('product.stock_quantity <= :threshold', { threshold });
      } else {
        queryBuilder = queryBuilder.andWhere('product.stock_quantity <= product.min_stock_level');
      }

      const products = await queryBuilder
        .orderBy('product.stock_quantity', 'ASC')
        .getMany();

      return {
        products: products.map(product => ({
          ...product,
          stock_status: this.getStockStatus(product),
        })),
        total: products.length,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async duplicateProduct(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // Create a copy with modified name and SKU
      const duplicateData = {
        ...product,
        name: `${product.name} (Copy)`,
        sku: await this.generateSKU(`${product.name} Copy`),
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
      };

      const duplicatedProduct = await this.productRepository.create(duplicateData);

      return {
        message: 'Product duplicated successfully',
        data: duplicatedProduct,
      };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async exportProductsCSV(filters: any) {
    try {
      // Get all products with filters (no pagination for export)
      const result = await this.getAllProducts({
        ...filters,
        page: 1,
        limit: 10000, // Large limit for export
      });
      const products = result.products;

      // Generate CSV content
      const headers = 'ID,Name,SKU,Category,Price,Cost Price,Stock,Status,Created Date\n';
      const rows = products.map(product => 
        `${product.id},"${product.name}","${product.sku}","${product.category?.name || 'N/A'}",${product.price},${product.cost_price || 0},${product.stock_quantity},${product.status},${product.created_at}`
      ).join('\n');

      const csvContent = headers + rows;

      return {
        content: csvContent,
        filename: `products_export_${new Date().toISOString().split('T')[0]}.csv`,
        contentType: 'text/csv',
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  // Helper methods
  private getStockStatus(product: any): string {
    if (!product.manage_stock) return 'not_managed';
    if (product.stock_quantity === 0) return 'out_of_stock';
    if (product.stock_quantity <= product.min_stock_level) return 'low_stock';
    return 'in_stock';
  }

  private calculateProfitMargin(price: number, costPrice: number): number {
    if (!costPrice || costPrice === 0) return 0;
    return ((price - costPrice) / price) * 100;
  }

  private async generateSKU(productName: string): Promise<string> {
    const prefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    return `${prefix}${timestamp}${random}`;
  }
}
