import { PartialType } from '@nestjs/mapped-types';
import { CreateSectorGoalDto } from './create-sector-goal.dto';

export class UpdateSectorGoalDto extends PartialType(CreateSectorGoalDto) {}
