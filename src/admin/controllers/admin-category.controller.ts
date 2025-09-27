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
import { AdminCategoryService } from '../services/admin-category.service';
import { AdminGuard } from '../guards/admin.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';

@ApiTags('Admin - Category Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AdminGuard, PermissionsGuard)
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Post()
  @RequirePermissions({ resource: 'categories', action: 'create' })
  @ApiOperation({ 
    summary: 'Create new category (Admin)',
    description: 'Create a new product category with optional parent category'
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Category created successfully',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        is_active: true
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminCategoryService.createCategory(createCategoryDto);
  }

  @Get()
  @RequirePermissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ 
    summary: 'Get all categories (Admin)',
    description: 'Retrieve all categories with hierarchy and product counts'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name', example: 'electronics' })
  @ApiQuery({ name: 'parent_id', required: false, description: 'Filter by parent category', example: 1 })
  @ApiQuery({ name: 'is_active', required: false, description: 'Filter by active status', example: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Categories retrieved successfully',
    example: {
      categories: [
        {
          id: 1,
          name: 'Electronics',
          description: 'Electronic devices',
          is_active: true,
          products_count: 25,
          parent: null,
          children: []
        }
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  })
  getAllCategories(@Query() filters: any) {
    return this.adminCategoryService.getAllCategories(filters);
  }

  @Get('tree')
  @RequirePermissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ 
    summary: 'Get category tree',
    description: 'Retrieve categories in hierarchical tree structure'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category tree retrieved',
    example: {
      categories: [
        {
          id: 1,
          name: 'Electronics',
          children: [
            { id: 2, name: 'Laptops', children: [] },
            { id: 3, name: 'Phones', children: [] }
          ]
        }
      ]
    }
  })
  getCategoryTree() {
    return this.adminCategoryService.getCategoryTree();
  }

  @Get(':id')
  @RequirePermissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ 
    summary: 'Get category by ID (Admin)',
    description: 'Retrieve detailed category information including analytics'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Category found',
    example: {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices',
      is_active: true,
      products_count: 25,
      subcategories_count: 3,
      parent: null,
      children: []
    }
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.adminCategoryService.getCategoryById(id);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'categories', action: 'update' })
  @ApiOperation({ 
    summary: 'Update category (Admin)',
    description: 'Update category information and hierarchy'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Category updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.adminCategoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'categories', action: 'delete' })
  @ApiOperation({ 
    summary: 'Delete category (Admin)',
    description: 'Delete a category (checks for products and subcategories first)'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiQuery({ name: 'force', required: false, description: 'Force delete with products/subcategories', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Category deleted successfully',
    example: { 
      message: 'DELETED_SUCCESSFULLY',
      moved_products: 0,
      moved_subcategories: 0
    }
  })
  @ApiResponse({ status: 400, description: 'Cannot delete - category in use' })
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force?: string,
  ) {
    const forceDelete = force === 'true';
    return this.adminCategoryService.deleteCategory(id, forceDelete);
  }

  @Patch(':id/toggle-status')
  @RequirePermissions({ resource: 'categories', action: 'update' })
  @ApiOperation({ 
    summary: 'Toggle category status',
    description: 'Activate or deactivate a category (affects subcategories)'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Category status updated',
    example: { 
      message: 'Category status updated successfully',
      is_active: false,
      affected_subcategories: 3
    }
  })
  toggleCategoryStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminCategoryService.toggleCategoryStatus(id);
  }

  @Patch(':id/move')
  @RequirePermissions({ resource: 'categories', action: 'update' })
  @ApiOperation({ 
    summary: 'Move category',
    description: 'Move category to a different parent (or make it root)'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        new_parent_id: { type: 'number', nullable: true, example: 2, description: 'New parent ID (null for root)' }
      } 
    } 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Category moved successfully',
    example: { 
      message: 'Category moved successfully',
      category_id: 1,
      new_parent_id: 2
    }
  })
  moveCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('new_parent_id') newParentId: number | null,
  ) {
    return this.adminCategoryService.moveCategory(id, newParentId);
  }

  @Get(':id/analytics')
  @RequirePermissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ 
    summary: 'Get category analytics',
    description: 'Retrieve detailed analytics for a specific category'
  })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Category analytics retrieved',
    example: {
      category: { id: 1, name: 'Electronics' },
      products: {
        total: 25,
        active: 23,
        inactive: 2,
        total_value: 12500.00
      },
      subcategories: { total: 3 },
      sales: {
        total_orders: 150,
        total_revenue: 45000.00,
        average_order_value: 300.00,
        top_selling_products: []
      }
    }
  })
  getCategoryAnalytics(@Param('id', ParseIntPipe) id: number) {
    return this.adminCategoryService.getCategoryAnalytics(id);
  }
}
