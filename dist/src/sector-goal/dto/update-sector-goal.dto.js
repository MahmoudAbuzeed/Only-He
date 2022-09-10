"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectorGoalDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sector_goal_dto_1 = require("./create-sector-goal.dto");
class UpdateSectorGoalDto extends (0, mapped_types_1.PartialType)(create_sector_goal_dto_1.CreateSectorGoalDto) {
}
exports.UpdateSectorGoalDto = UpdateSectorGoalDto;
//# sourceMappingURL=update-sector-goal.dto.js.map