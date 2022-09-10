"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectHistoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_project_history_dto_1 = require("./create-project-history.dto");
class UpdateProjectHistoryDto extends (0, mapped_types_1.PartialType)(create_project_history_dto_1.CreateProjectHistoryDto) {
}
exports.UpdateProjectHistoryDto = UpdateProjectHistoryDto;
//# sourceMappingURL=update-project-history.dto.js.map