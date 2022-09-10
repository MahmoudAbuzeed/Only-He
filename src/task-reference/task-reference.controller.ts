import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskReferenceService } from './task-reference.service';
import { CreateTaskReferenceDto } from './dto/create-task-reference.dto';
import { UpdateTaskReferenceDto } from './dto/update-task-reference.dto';

@Controller('task-reference')
export class TaskReferenceController {
  constructor(private readonly taskReferenceService: TaskReferenceService) {}

  @Post()
  create(@Body() createTaskReferenceDto: CreateTaskReferenceDto) {
    return this.taskReferenceService.create(createTaskReferenceDto);
  }

  @Get()
  findAll() {
    return this.taskReferenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskReferenceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskReferenceDto: UpdateTaskReferenceDto,
  ) {
    return this.taskReferenceService.update(+id, updateTaskReferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskReferenceService.remove(+id);
  }
}
