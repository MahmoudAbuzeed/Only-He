import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskReferenceDto } from './create-task-reference.dto';

export class UpdateTaskReferenceDto extends PartialType(CreateTaskReferenceDto) {}
