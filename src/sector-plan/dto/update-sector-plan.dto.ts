import { PartialType } from '@nestjs/mapped-types';
import { CreateSectorPlanDto } from './create-sector-plan.dto';

export class UpdateSectorPlanDto extends PartialType(CreateSectorPlanDto) {}
