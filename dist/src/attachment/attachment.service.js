"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
const common_1 = require("@nestjs/common");
const attachment_repository_1 = require("./attachment.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let AttachmentService = class AttachmentService {
    constructor(attachmentRepo, errorHandler) {
        this.attachmentRepo = attachmentRepo;
        this.errorHandler = errorHandler;
    }
    async create(createAttachmentDto) {
        try {
            await this.attachmentRepo.create(createAttachmentDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.attachmentRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const attachment = await this.attachmentRepo.findOne(id);
        if (!attachment)
            throw this.errorHandler.notFound();
        return attachment;
    }
    async update(id, updateAttachmentDto) {
        const updatedAttachment = await this.attachmentRepo.update(id, updateAttachmentDto);
        if (updatedAttachment.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedAttachment = await this.attachmentRepo.remove(+id);
        if (deletedAttachment.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
AttachmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attachment_repository_1.AttachmentRepo,
        errorHandler_service_1.ErrorHandler])
], AttachmentService);
exports.AttachmentService = AttachmentService;
//# sourceMappingURL=attachment.service.js.map