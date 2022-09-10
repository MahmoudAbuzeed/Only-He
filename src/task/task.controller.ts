import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    createTaskDto.start_date = new Date(createTaskDto.start_date);
    createTaskDto.start_date = new Date(createTaskDto.start_date);
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    updateTaskDto.start_date = new Date(updateTaskDto.start_date);
    updateTaskDto.start_date = new Date(updateTaskDto.start_date);
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch('sectors/:id')
  updateSectors(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.taskService.updateComponentSectors(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
