import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { AttachmentRepo } from './attachment.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class AttachmentService {
    private readonly attachmentRepo;
    private readonly errorHandler;
    constructor(attachmentRepo: AttachmentRepo, errorHandler: ErrorHandler);
    create(createAttachmentDto: CreateAttachmentDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/attachment.entity").Attachment[]>;
    findOne(id: number): Promise<import("./entities/attachment.entity").Attachment>;
    update(id: number, updateAttachmentDto: UpdateAttachmentDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
