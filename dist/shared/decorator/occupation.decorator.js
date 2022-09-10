"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationsGuard = exports.OCCUPATIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.OCCUPATIONS_KEY = 'occupations';
const OccupationsGuard = (...occupations) => (0, common_1.SetMetadata)(exports.OCCUPATIONS_KEY, occupations);
exports.OccupationsGuard = OccupationsGuard;
//# sourceMappingURL=occupation.decorator.js.map