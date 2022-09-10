import { PartialType } from '@nestjs/mapped-types';
import { CreateStackHolderDto } from './create-stack-holder.dto';

export class UpdateStackHolderDto extends PartialType(CreateStackHolderDto) {}
