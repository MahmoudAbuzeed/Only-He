"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComponentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_component_dto_1 = require("./create-component.dto");
class UpdateComponentDto extends (0, mapped_types_1.PartialType)(create_component_dto_1.CreateComponentDto) {
}
exports.UpdateComponentDto = UpdateComponentDto;
//# sourceMappingURL=update-component.dto.js.map