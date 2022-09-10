import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectObjectiveService } from './project-objective.service';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';

@Controller('project-objective')
export class ProjectObjectiveController {
  constructor(
    private readonly projectObjectiveService: ProjectObjectiveService,
  ) {}

  @Post()
  create(@Body() createProjectObjectiveDto: CreateProjectObjectiveDto) {
    return this.projectObjectiveService.create(createProjectObjectiveDto);
  }

  @Get()
  findAll() {
    return this.projectObjectiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectObjectiveService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectObjectiveDto: UpdateProjectObjectiveDto,
  ) {
    return this.projectObjectiveService.update(+id, updateProjectObjectiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectObjectiveService.remove(+id);
  }
}
