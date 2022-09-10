"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectorPlanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sector_plan_dto_1 = require("./create-sector-plan.dto");
class UpdateSectorPlanDto extends (0, mapped_types_1.PartialType)(create_sector_plan_dto_1.CreateSectorPlanDto) {
}
exports.UpdateSectorPlanDto = UpdateSectorPlanDto;
//# sourceMappingURL=update-sector-plan.dto.js.map