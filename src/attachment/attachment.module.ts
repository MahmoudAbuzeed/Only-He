import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attachment } from './entities/attachment.entity';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { AttachmentRepo } from './attachment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],

  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepo],
})
export class AttachmentModule {}
