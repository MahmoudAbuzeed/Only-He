import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Controller('component')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  create(@Body() createComponentDto: CreateComponentDto) {
    createComponentDto.start_date = new Date(createComponentDto.start_date);
    createComponentDto.start_date = new Date(createComponentDto.start_date);
    return this.componentService.create(createComponentDto);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    updateComponentDto.start_date = new Date(updateComponentDto.start_date);
    updateComponentDto.start_date = new Date(updateComponentDto.start_date);
    return this.componentService.update(+id, updateComponentDto);
  }

  @Patch('sectors/:id')
  updateSectors(@Param('id') id: string, @Body() updateComponentDto: any) {
    return this.componentService.updateComponentSectors(
      +id,
      updateComponentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentService.remove(+id);
  }
}
