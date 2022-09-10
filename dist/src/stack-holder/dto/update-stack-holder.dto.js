"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStackHolderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_stack_holder_dto_1 = require("./create-stack-holder.dto");
class UpdateStackHolderDto extends (0, mapped_types_1.PartialType)(create_stack_holder_dto_1.CreateStackHolderDto) {
}
exports.UpdateStackHolderDto = UpdateStackHolderDto;
//# sourceMappingURL=update-stack-holder.dto.js.map