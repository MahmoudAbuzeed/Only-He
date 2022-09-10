"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFinanceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_finance_dto_1 = require("./create-finance.dto");
class UpdateFinanceDto extends (0, mapped_types_1.PartialType)(create_finance_dto_1.CreateFinanceDto) {
}
exports.UpdateFinanceDto = UpdateFinanceDto;
//# sourceMappingURL=update-finance.dto.js.map