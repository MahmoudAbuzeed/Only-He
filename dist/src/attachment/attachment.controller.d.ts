import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
export declare class AttachmentController {
    private readonly attachmentService;
    constructor(attachmentService: AttachmentService);
    create(createAttachmentDto: CreateAttachmentDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/attachment.entity").Attachment[]>;
    findOne(id: string): Promise<import("./entities/attachment.entity").Attachment>;
    update(id: string, updateAttachmentDto: UpdateAttachmentDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
