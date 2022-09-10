"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sector_dto_1 = require("./create-sector.dto");
class UpdateSectorDto extends (0, mapped_types_1.PartialType)(create_sector_dto_1.CreateSectorDto) {
}
exports.UpdateSectorDto = UpdateSectorDto;
//# sourceMappingURL=update-sector.dto.js.map