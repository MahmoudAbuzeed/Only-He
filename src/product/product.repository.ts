import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Product, ProductStatus } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findWithFilters(filters: ProductFilterDto) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    this.applyFilters(queryBuilder, filters);

    // Pagination
    const skip = (filters.page - 1) * filters.limit;
    queryBuilder.skip(skip).take(filters.limit);

    // Sorting
    const sortField = this.getSortField(filters.sort_by);
    queryBuilder.orderBy(sortField, filters.sort_order);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async findActive(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { status: ProductStatus.ACTIVE },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findFeatured(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { is_featured: true, status: ProductStatus.ACTIVE },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category_id: categoryId, status: ProductStatus.ACTIVE },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async findBySku(sku: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { sku },
      relations: ['category'],
    });
  }

  async findLowStock(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.manage_stock = :manageStock', { manageStock: true })
      .andWhere('product.stock_quantity <= product.min_stock_level')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.stock_quantity', 'ASC')
      .getMany();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
  }

  async updateStock(id: number, quantity: number) {
    return await this.productRepository.update(id, { stock_quantity: quantity });
  }

  async decreaseStock(id: number, quantity: number) {
    return await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ stock_quantity: () => 'stock_quantity - :quantity' })
      .where('id = :id', { id })
      .andWhere('stock_quantity >= :quantity', { quantity })
      .setParameters({ quantity })
      .execute();
  }

  async increaseStock(id: number, quantity: number) {
    return await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ stock_quantity: () => 'stock_quantity + :quantity' })
      .where('id = :id', { id })
      .setParameters({ quantity })
      .execute();
  }

  async remove(id: number) {
    return await this.productRepository.delete({ id });
  }

  async search(searchTerm: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('product.description ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('product.sku ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .orderBy('product.created_at', 'DESC')
      .getMany();
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Product>, filters: ProductFilterDto) {
    if (filters.category_id) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId: filters.category_id });
    }

    if (filters.status) {
      queryBuilder.andWhere('product.status = :status', { status: filters.status });
    }

    if (filters.is_featured !== undefined) {
      queryBuilder.andWhere('product.is_featured = :isFeatured', { isFeatured: filters.is_featured });
    }

    if (filters.is_digital !== undefined) {
      queryBuilder.andWhere('product.is_digital = :isDigital', { isDigital: filters.is_digital });
    }

    if (filters.min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.min_price });
    }

    if (filters.max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.max_price });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }
  }

  private getSortField(sortBy: string): string {
    const allowedSortFields = {
      name: 'product.name',
      price: 'product.price',
      created_at: 'product.created_at',
      updated_at: 'product.updated_at',
      stock_quantity: 'product.stock_quantity',
    };

    return allowedSortFields[sortBy] || 'product.created_at';
  }

  // Additional methods for AdminProductService
  async findBySKU(sku: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { sku } });
  }

  async findOneWithDetails(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async bulkUpdateStatus(productIds: number[], status: ProductStatus) {
    return await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ status })
      .whereInIds(productIds)
      .execute();
  }

  async countByCategory(categoryId: number): Promise<number> {
    return await this.productRepository.count({ where: { category_id: categoryId } });
  }

  async countActiveByCategoryId(categoryId: number): Promise<number> {
    return await this.productRepository.count({ 
      where: { 
        category_id: categoryId, 
        status: ProductStatus.ACTIVE 
      } 
    });
  }

  async getTotalValueByCategory(categoryId: number): Promise<number> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock_quantity * product.cost_price)', 'total')
      .where('product.category_id = :categoryId', { categoryId })
      .andWhere('product.cost_price IS NOT NULL')
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async moveCategoryProducts(fromCategoryId: number, toCategoryId: number | null): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ category_id: toCategoryId })
      .where('category_id = :fromCategoryId', { fromCategoryId })
      .execute();
  }

  createQueryBuilder(alias: string) {
    return this.productRepository.createQueryBuilder(alias);
  }
}
