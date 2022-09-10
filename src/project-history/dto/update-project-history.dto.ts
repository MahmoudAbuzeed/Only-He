import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectHistoryDto } from './create-project-history.dto';

export class UpdateProjectHistoryDto extends PartialType(
  CreateProjectHistoryDto,
) {}
