import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectorGoalService } from './sector-goal.service';
import { CreateSectorGoalDto } from './dto/create-sector-goal.dto';
import { UpdateSectorGoalDto } from './dto/update-sector-goal.dto';

@Controller('sector-goal')
export class SectorGoalController {
  constructor(private readonly sectorGoalService: SectorGoalService) {}

  @Post()
  create(@Body() createSectorGoalDto: CreateSectorGoalDto) {
    return this.sectorGoalService.create(createSectorGoalDto);
  }

  @Get()
  findAll() {
    return this.sectorGoalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectorGoalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSectorGoalDto: UpdateSectorGoalDto,
  ) {
    return this.sectorGoalService.update(+id, updateSectorGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectorGoalService.remove(+id);
  }
}
