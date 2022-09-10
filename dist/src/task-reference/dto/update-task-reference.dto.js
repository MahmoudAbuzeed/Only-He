"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskReferenceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_task_reference_dto_1 = require("./create-task-reference.dto");
class UpdateTaskReferenceDto extends (0, mapped_types_1.PartialType)(create_task_reference_dto_1.CreateTaskReferenceDto) {
}
exports.UpdateTaskReferenceDto = UpdateTaskReferenceDto;
//# sourceMappingURL=update-task-reference.dto.js.map