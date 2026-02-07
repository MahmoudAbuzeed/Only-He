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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { toLocalizedEntity } from '../common/utils/i18n.util';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Request() req: any, @Query('active') active?: string) {
    const data = active === 'true'
      ? await this.categoryService.findActive()
      : await this.categoryService.findAll();
    const lang = req.language || 'en';
    const list = Array.isArray(data) ? data : [data];
    return list.map((c: any) => toLocalizedEntity(c, lang, 'category'));
  }

  @Get('root')
  async findRootCategories(@Request() req: any) {
    const data = await this.categoryService.findRootCategories();
    const lang = req.language || 'en';
    return (data || []).map((c: any) => toLocalizedEntity(c, lang, 'category'));
  }

  @Get('search')
  async search(@Request() req: any, @Query('q') searchTerm: string) {
    const data = await this.categoryService.search(searchTerm);
    const lang = req.language || 'en';
    return (data || []).map((c: any) => toLocalizedEntity(c, lang, 'category'));
  }

  @Get('parent/:parentId')
  async findByParent(@Request() req: any, @Param('parentId', ParseIntPipe) parentId: number) {
    const data = await this.categoryService.findByParent(parentId);
    const lang = req.language || 'en';
    return (data || []).map((c: any) => toLocalizedEntity(c, lang, 'category'));
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const data = await this.categoryService.findOne(id);
    return toLocalizedEntity(data, req.language || 'en', 'category');
  }

  @Get(':id/products')
  async findWithProducts(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findWithProducts(id);
    const lang = req.language || 'en';
    const out = toLocalizedEntity(category, lang, 'category') as any;
    if (out?.products?.length) {
      out.products = out.products.map((p: any) => toLocalizedEntity(p, lang, 'product'));
    }
    return out;
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
