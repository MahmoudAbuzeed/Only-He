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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.categoryService.findActive();
    }
    return this.categoryService.findAll();
  }

  @Get('root')
  findRootCategories() {
    return this.categoryService.findRootCategories();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.categoryService.search(searchTerm);
  }

  @Get('parent/:parentId')
  findByParent(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.categoryService.findByParent(parentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Get(':id/products')
  findWithProducts(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findWithProducts(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
