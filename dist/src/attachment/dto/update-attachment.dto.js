"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttachmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_attachment_dto_1 = require("./create-attachment.dto");
class UpdateAttachmentDto extends (0, mapped_types_1.PartialType)(create_attachment_dto_1.CreateAttachmentDto) {
}
exports.UpdateAttachmentDto = UpdateAttachmentDto;
//# sourceMappingURL=update-attachment.dto.js.map