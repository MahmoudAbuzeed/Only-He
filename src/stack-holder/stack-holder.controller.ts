import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StackHolderService } from './stack-holder.service';
import { CreateStackHolderDto } from './dto/create-stack-holder.dto';
import { UpdateStackHolderDto } from './dto/update-stack-holder.dto';

@Controller('stack-holder')
export class StackHolderController {
  constructor(private readonly stackHolderService: StackHolderService) {}

  @Post()
  create(@Body() createStackHolderDto: CreateStackHolderDto) {
    return this.stackHolderService.create(createStackHolderDto);
  }

  @Get()
  findAll() {
    return this.stackHolderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stackHolderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStackHolderDto: UpdateStackHolderDto,
  ) {
    return this.stackHolderService.update(+id, updateStackHolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stackHolderService.remove(+id);
  }

  @Get('/projects/:id')
  findAllProjects(@Param('id') id: string) {
    return this.stackHolderService.findAllProjects(+id);
  }
}
