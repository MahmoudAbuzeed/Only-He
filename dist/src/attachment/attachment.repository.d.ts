import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
export declare class AttachmentRepo {
    private attachmentRepository;
    constructor(attachmentRepository: Repository<Attachment>);
    create(createAttachmentDto: CreateAttachmentDto): Promise<CreateAttachmentDto & Attachment>;
    findAll(): Promise<Attachment[]>;
    findOne(id: number): Promise<Attachment>;
    update(id: number, updateAttachmentDto: UpdateAttachmentDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
