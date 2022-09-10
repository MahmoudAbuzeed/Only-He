import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class AttachmentRepo {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    return await this.attachmentRepository.save(createAttachmentDto);
  }

  async findAll() {
    return await this.attachmentRepository.find();
  }

  async findOne(id: number) {
    return await this.attachmentRepository.findOne(id);
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return await this.attachmentRepository.update(id, updateAttachmentDto);
  }

  async remove(id: number) {
    return await this.attachmentRepository.delete({ id });
  }
}
