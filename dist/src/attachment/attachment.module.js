"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attachment_entity_1 = require("./entities/attachment.entity");
const attachment_service_1 = require("./attachment.service");
const attachment_controller_1 = require("./attachment.controller");
const attachment_repository_1 = require("./attachment.repository");
let AttachmentModule = class AttachmentModule {
};
AttachmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([attachment_entity_1.Attachment])],
        controllers: [attachment_controller_1.AttachmentController],
        providers: [attachment_service_1.AttachmentService, attachment_repository_1.AttachmentRepo],
    })
], AttachmentModule);
exports.AttachmentModule = AttachmentModule;
//# sourceMappingURL=attachment.module.js.map