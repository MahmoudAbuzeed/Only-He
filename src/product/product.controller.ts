import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { toLocalizedEntity } from '../common/utils/i18n.util';

function localizeProduct(p: any, lang: string) {
  const out = toLocalizedEntity(p, lang as 'en' | 'ar', 'product');
  if (out && (p as any).category) {
    (out as any).category = toLocalizedEntity((p as any).category, lang as 'en' | 'ar', 'category');
  }
  return out;
}

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Add a new product to the catalog with all necessary details including pricing, inventory, and category'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 1,
        name: 'iPhone 15 Pro',
        sku: 'IPH15PRO128',
        price: 999.99,
        category_id: 5
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or duplicate SKU' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get products with filters',
    description: 'Retrieve products with optional filtering, pagination, and sorting'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID', example: 5 })
  @ApiQuery({ name: 'min_price', required: false, description: 'Minimum price filter', example: 10 })
  @ApiQuery({ name: 'max_price', required: false, description: 'Maximum price filter', example: 1000 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'iPhone' })
  @ApiQuery({ name: 'is_featured', required: false, description: 'Filter featured products', example: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Products retrieved successfully',
    example: {
      products: [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          price: 999.99,
          stock_quantity: 50,
          images: ['image1.jpg'],
          category: { id: 5, name: 'Smartphones' }
        }
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  })
  async findAll(@Request() req: any, @Query() filters: ProductFilterDto) {
    const lang = req.language || 'en';
    if (Object.keys(filters).length === 0) {
      const data = await this.productService.findAll();
      return (data || []).map((p: any) => localizeProduct(p, lang));
    }
    const result = await this.productService.findWithFilters(filters);
    if (result.products) {
      (result as any).products = result.products.map((p: any) => localizeProduct(p, lang));
    }
    return result;
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Get active products',
    description: 'Retrieve only products with active status'
  })
  @ApiResponse({ status: 200, description: 'Active products retrieved successfully' })
  async findActive(@Request() req: any) {
    const data = await this.productService.findActive();
    return (data || []).map((p: any) => localizeProduct(p, req.language || 'en'));
  }

  @Get('featured')
  @ApiOperation({ 
    summary: 'Get featured products',
    description: 'Retrieve products marked as featured'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Featured products retrieved successfully',
    example: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 999.99,
        is_featured: true,
        images: ['image1.jpg'],
        category: { id: 5, name: 'Smartphones' }
      }
    ]
  })
  async findFeatured(@Request() req: any) {
    const data = await this.productService.findFeatured();
    return (data || []).map((p: any) => localizeProduct(p, req.language || 'en'));
  }

  @Get('low-stock')
  @ApiOperation({ 
    summary: 'Get low stock products',
    description: 'Retrieve products with stock quantity at or below minimum stock level'
  })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully' })
  async findLowStock(@Request() req: any) {
    const data = await this.productService.findLowStock();
    return (data || []).map((p: any) => localizeProduct(p, req.language || 'en'));
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search products',
    description: 'Search products by name, description, or SKU'
  })
  @ApiQuery({ name: 'q', description: 'Search term (minimum 2 characters)', example: 'iPhone' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Search term too short' })
  async search(@Request() req: any, @Query('q') searchTerm: string) {
    const data = await this.productService.search(searchTerm);
    return (data || []).map((p: any) => localizeProduct(p, req.language || 'en'));
  }

  @Get('category/:categoryId')
  @ApiOperation({ 
    summary: 'Get products by category',
    description: 'Retrieve all active products in a specific category'
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID', example: 5 })
  @ApiResponse({ status: 200, description: 'Products in category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategory(@Request() req: any, @Param('categoryId', ParseIntPipe) categoryId: number) {
    const data = await this.productService.findByCategory(categoryId);
    return (data || []).map((p: any) => localizeProduct(p, req.language || 'en'));
  }

  @Get('sku/:sku')
  @ApiOperation({ 
    summary: 'Get product by SKU',
    description: 'Retrieve product information using SKU'
  })
  @ApiParam({ name: 'sku', description: 'Product SKU', example: 'IPH15PRO128' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySku(@Request() req: any, @Param('sku') sku: string) {
    const data = await this.productService.findBySku(sku);
    return data ? localizeProduct(data, req.language || 'en') : data;
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product by ID',
    description: 'Retrieve detailed product information by product ID'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product found',
    example: {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      price: 999.99,
      stock_quantity: 50,
      images: ['image1.jpg', 'image2.jpg'],
      category: { id: 5, name: 'Smartphones' },
      attributes: { color: 'Space Black', storage: '128GB' }
    }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const data = await this.productService.findOne(id);
    return data ? localizeProduct(data, req.language || 'en') : data;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update product',
    description: 'Update product information by product ID'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ 
    summary: 'Update product stock',
    description: 'Update stock quantity for a specific product'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        quantity: { type: 'number', example: 100, description: 'New stock quantity' } 
      } 
    } 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.productService.updateStock(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete product',
    description: 'Delete product from catalog by product ID'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deleted successfully',
    example: { message: 'DELETED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
