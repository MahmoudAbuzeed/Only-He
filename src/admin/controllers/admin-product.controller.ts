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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminProductService } from '../services/admin-product.service';
import { AdminGuard } from '../guards/admin.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { UpdateProductDto } from '../../product/dto/update-product.dto';

@ApiTags('Admin - Product Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard, PermissionsGuard)
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Post()
  @RequirePermissions({ resource: 'products', action: 'create' })
  @ApiOperation({ 
    summary: 'Create new product (Admin)',
    description: 'Create a new product with category assignment and inventory management'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 1,
        name: 'Sample Product',
        sku: 'SKU001',
        price: 99.99,
        category_id: 1
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminProductService.createProduct(createProductDto);
  }

  @Get()
  @RequirePermissions({ resource: 'products', action: 'read' })
  @ApiOperation({ 
    summary: 'Get all products (Admin)',
    description: 'Retrieve all products with advanced filtering, pagination, and stock information'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name (en/ar), description, or SKU', example: 'laptop' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID', example: 1 })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (e.g. active, inactive)', example: 'active' })
  @ApiQuery({ name: 'min_price', required: false, description: 'Minimum price', example: 10 })
  @ApiQuery({ name: 'max_price', required: false, description: 'Maximum price', example: 1000 })
  @ApiQuery({ name: 'low_stock', required: false, description: 'Only low stock: "true"', example: 'true' })
  @ApiQuery({ name: 'sort_by', required: false, description: 'Sort field: name, price, stock_quantity, created_at, updated_at', example: 'created_at' })
  @ApiQuery({ name: 'sort_order', required: false, description: 'Sort order: ASC | DESC', example: 'DESC' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products retrieved successfully',
    example: {
      products: [
        {
          id: 1,
          name: 'Sample Product',
          sku: 'SKU001',
          price: 99.99,
          stock_quantity: 50,
          stock_status: 'in_stock',
          category: { id: 1, name: 'Electronics' }
        }
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  })
  getAllProducts(@Query() filters: any) {
    return this.adminProductService.getAllProducts(filters);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'products', action: 'read' })
  @ApiOperation({ 
    summary: 'Get product by ID (Admin)',
    description: 'Retrieve detailed product information including sales statistics'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product found',
    example: {
      id: 1,
      name: 'Sample Product',
      sku: 'SKU001',
      price: 99.99,
      stock_quantity: 50,
      total_sold: 25,
      revenue_generated: 2499.75,
      category: { id: 1, name: 'Electronics' }
    }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.adminProductService.getProductById(id);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'products', action: 'update' })
  @ApiOperation({ 
    summary: 'Update product (Admin)',
    description: 'Update product information, pricing, and inventory'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminProductService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'products', action: 'delete' })
  @ApiOperation({ 
    summary: 'Delete product (Admin)',
    description: 'Delete a product (checks for existing orders/carts first)'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deleted successfully',
    example: { message: 'DELETED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 400, description: 'Cannot delete - product in use' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminProductService.deleteProduct(id);
  }

  @Patch(':id/stock')
  @RequirePermissions({ resource: 'products', action: 'manage_stock' })
  @ApiOperation({ 
    summary: 'Adjust product stock',
    description: 'Manually adjust product stock quantity with reason'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        quantity: { type: 'number', example: 10, description: 'Quantity to add/subtract' },
        reason: { type: 'string', example: 'Inventory recount', description: 'Reason for adjustment' }
      } 
    } 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock adjusted successfully',
    example: { 
      message: 'Stock adjusted successfully',
      previous_quantity: 50,
      new_quantity: 60,
      adjustment: 10,
      reason: 'Inventory recount'
    }
  })
  adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Body('reason') reason: string,
  ) {
    return this.adminProductService.adjustStock(id, quantity, reason);
  }

  @Get(':id/analytics')
  @RequirePermissions({ resource: 'products', action: 'read' })
  @ApiOperation({ 
    summary: 'Get product analytics',
    description: 'Retrieve detailed analytics for a specific product'
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product analytics retrieved',
    example: {
      product: { id: 1, name: 'Sample Product', sku: 'SKU001' },
      analytics: {
        total_sold: 25,
        revenue_generated: 2499.75,
        profit_generated: 1249.75,
        favorites_count: 12
      }
    }
  })
  getProductAnalytics(@Param('id', ParseIntPipe) id: number) {
    return this.adminProductService.getProductAnalytics(id);
  }

  @Get('low-stock/list')
  @RequirePermissions({ resource: 'products', action: 'read' })
  @ApiOperation({ 
    summary: 'Get low stock products',
    description: 'Retrieve products with low stock levels'
  })
  @ApiQuery({ name: 'threshold', required: false, description: 'Custom threshold', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Low stock products retrieved',
    example: {
      products: [
        {
          id: 1,
          name: 'Sample Product',
          sku: 'SKU001',
          stock_quantity: 5,
          min_stock_level: 10,
          stock_status: 'low_stock'
        }
      ],
      total: 1
    }
  })
  getLowStockProducts(@Query('threshold', ParseIntPipe) threshold?: number) {
    return this.adminProductService.getLowStockProducts(threshold);
  }
}
