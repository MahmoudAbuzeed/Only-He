import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectHistoryService } from './project-history.service';
import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';

@Controller('project-history')
export class ProjectHistoryController {
  constructor(private readonly projectHistoryService: ProjectHistoryService) {}

  @Post()
  create(@Body() createProjectHistoryDto: CreateProjectHistoryDto) {
    return this.projectHistoryService.create(createProjectHistoryDto);
  }

  @Get()
  findAll() {
    return this.projectHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectHistoryDto: UpdateProjectHistoryDto,
  ) {
    return this.projectHistoryService.update(+id, updateProjectHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectHistoryService.remove(+id);
  }
}
