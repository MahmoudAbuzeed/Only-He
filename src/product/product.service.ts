import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from '../category/category.repository';
import { OrderItem } from '../order/entities/order-item.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { ErrorHandler } from 'shared/errorHandler.service';
import { ImagesService } from '../images/images.service';
import { ImageType } from '../images/entities/image.entity';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly errorHandler: ErrorHandler,
    private readonly imagesService: ImagesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Validate category exists
      const category = await this.categoryRepository.findOne(createProductDto.category_id);
      if (!category) {
        throw this.errorHandler.badRequest({ message: 'Category not found' });
      }

      // Check if SKU already exists
      const existingProduct = await this.productRepository.findBySku(createProductDto.sku);
      if (existingProduct) {
        throw this.errorHandler.badRequest({ message: 'Product with this SKU already exists' });
      }

      // Generate slug for SEO if not provided
      if (createProductDto.seo_data && !createProductDto.seo_data.slug) {
        createProductDto.seo_data.slug = this.generateSlug(createProductDto.name);
      }

      const product = await this.productRepository.create(createProductDto);
      return { message: CREATED_SUCCESSFULLY, data: product };
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.findAll();
      return await this.includeImagesInProducts(products);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findWithFilters(filters: ProductFilterDto) {
    try {
      const result = await this.productRepository.findWithFilters(filters);
      if (result.products) {
        result.products = await this.includeImagesInProducts(result.products);
      }
      return result;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findActive() {
    try {
      const products = await this.productRepository.findActive();
      return await this.includeImagesInProducts(products);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findFeatured() {
    try {
      const products = await this.productRepository.findFeatured();
      return products;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findByCategory(categoryId: number) {
    try {
      // Validate category exists
      const category = await this.categoryRepository.findOne(categoryId);
      if (!category) {
        throw this.errorHandler.notFound({ message: 'Category not found' });
      }

      const products = await this.productRepository.findByCategory(categoryId);
      return products;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound();
      }
      return product;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findBySku(sku: string) {
    try {
      const product = await this.productRepository.findBySku(sku);
      if (!product) {
        throw this.errorHandler.notFound();
      }
      return product;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findLowStock() {
    try {
      const products = await this.productRepository.findLowStock();
      return products;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      // Check if product exists
      const existingProduct = await this.productRepository.findOne(id);
      if (!existingProduct) {
        throw this.errorHandler.notFound();
      }

      // Validate category exists if being updated
      if (updateProductDto.category_id) {
        const category = await this.categoryRepository.findOne(updateProductDto.category_id);
        if (!category) {
          throw this.errorHandler.badRequest({ message: 'Category not found' });
        }
      }

      // Check if SKU already exists (excluding current product)
      if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
        const existingSkuProduct = await this.productRepository.findBySku(updateProductDto.sku);
        if (existingSkuProduct) {
          throw this.errorHandler.badRequest({ message: 'Product with this SKU already exists' });
        }
      }

      // Generate slug for SEO if name is being updated
      if (updateProductDto.name && updateProductDto.seo_data) {
        if (!updateProductDto.seo_data.slug) {
          updateProductDto.seo_data.slug = this.generateSlug(updateProductDto.name);
        }
      }

      const updatedProduct = await this.productRepository.update(id, updateProductDto);
      if (updatedProduct.affected === 0) {
        throw this.errorHandler.notFound();
      }
      
      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateStock(id: number, quantity: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound();
      }

      if (!product.manage_stock) {
        throw this.errorHandler.badRequest({ message: 'Stock management is disabled for this product' });
      }

      if (quantity < 0) {
        throw this.errorHandler.badRequest({ message: 'Stock quantity cannot be negative' });
      }

      await this.productRepository.updateStock(id, quantity);
      return { message: UPDATED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404 || error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) {
        throw this.errorHandler.notFound();
      }

      // Check if product is in any active orders or carts
      const [orderItemsCount, cartItemsCount] = await Promise.all([
        this.orderItemRepository.count({ where: { product_id: id } }),
        this.cartItemRepository.count({ where: { product_id: id } }),
      ]);

      if (orderItemsCount > 0) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete product. It exists in ${orderItemsCount} order(s). Consider deactivating instead.` 
        });
      }

      if (cartItemsCount > 0) {
        throw this.errorHandler.badRequest({ 
          message: `Cannot delete product. It exists in ${cartItemsCount} cart(s). Consider deactivating instead.` 
        });
      }

      const deletedProduct = await this.productRepository.remove(id);
      if (deletedProduct.affected === 0) {
        throw this.errorHandler.notFound();
      }
      
      return { message: DELETED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async search(searchTerm: string) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw this.errorHandler.badRequest({ message: 'Search term must be at least 2 characters long' });
      }
      
      const products = await this.productRepository.search(searchTerm.trim());
      return products;
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  // Inventory management methods
  async checkStock(productId: number, requestedQuantity: number): Promise<boolean> {
    const product = await this.productRepository.findOne(productId);
    if (!product) {
      return false;
    }

    if (!product.manage_stock) {
      return true; // Stock management disabled, always available
    }

    if (product.allow_backorder) {
      return true; // Backorders allowed
    }

    return product.stock_quantity >= requestedQuantity;
  }

  async reserveStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.productRepository.decreaseStock(productId, quantity);
      return result.affected > 0;
    } catch (error) {
      return false;
    }
  }

  async releaseStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.productRepository.increaseStock(productId, quantity);
      return result.affected > 0;
    } catch (error) {
      return false;
    }
  }

  private async includeImagesInProducts(products: any[]): Promise<any[]> {
    if (!products || products.length === 0) {
      return products;
    }

    const productIds = products.map(product => product.id);
    const imagesMap = await this.imagesService.getImagesByEntities(ImageType.PRODUCT, productIds);
    const primaryImagesMap = await this.imagesService.getPrimaryImagesByEntities(ImageType.PRODUCT, productIds);

    return products.map(product => ({
      ...product,
      images: this.imagesService.formatImagesForResponse(imagesMap[product.id] || []),
      primary_image: this.imagesService.formatImageForResponse(primaryImagesMap[product.id]),
    }));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}
