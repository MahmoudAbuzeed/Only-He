import { Injectable } from '@nestjs/common';

import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { AttachmentRepo } from './attachment.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from 'messages';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly attachmentRepo: AttachmentRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    try {
      await this.attachmentRepo.create(createAttachmentDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.attachmentRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const attachment = await this.attachmentRepo.findOne(id);
    if (!attachment) throw this.errorHandler.notFound();
    return attachment;
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    const updatedAttachment = await this.attachmentRepo.update(
      id,
      updateAttachmentDto,
    );
    if (updatedAttachment.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedAttachment = await this.attachmentRepo.remove(+id);
    if (deletedAttachment.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
