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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentController = void 0;
const common_1 = require("@nestjs/common");
const attachment_service_1 = require("./attachment.service");
const create_attachment_dto_1 = require("./dto/create-attachment.dto");
const update_attachment_dto_1 = require("./dto/update-attachment.dto");
let AttachmentController = class AttachmentController {
    constructor(attachmentService) {
        this.attachmentService = attachmentService;
    }
    create(createAttachmentDto) {
        return this.attachmentService.create(createAttachmentDto);
    }
    findAll() {
        return this.attachmentService.findAll();
    }
    findOne(id) {
        return this.attachmentService.findOne(+id);
    }
    update(id, updateAttachmentDto) {
        return this.attachmentService.update(+id, updateAttachmentDto);
    }
    remove(id) {
        return this.attachmentService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attachment_dto_1.CreateAttachmentDto]),
    __metadata("design:returntype", void 0)
], AttachmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttachmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttachmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attachment_dto_1.UpdateAttachmentDto]),
    __metadata("design:returntype", void 0)
], AttachmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttachmentController.prototype, "remove", null);
AttachmentController = __decorate([
    (0, common_1.Controller)('attachment'),
    __metadata("design:paramtypes", [attachment_service_1.AttachmentService])
], AttachmentController);
exports.AttachmentController = AttachmentController;
//# sourceMappingURL=attachment.controller.js.map