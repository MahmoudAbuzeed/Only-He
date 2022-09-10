"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const occupation_decorator_1 = require("../decorator/occupation.decorator");
let OccupationsGuard = class OccupationsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredOccupations = this.reflector.getAllAndOverride(occupation_decorator_1.OCCUPATIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredOccupations) {
            return true;
        }
        const { user, headers } = context.switchToHttp().getRequest();
        if (requiredOccupations.some((occupation) => {
            var _a, _b, _c;
            return ((_c = (_b = (_a = user.organization) === null || _a === void 0 ? void 0 : _a.find((org) => org._id == headers.organization)) === null || _b === void 0 ? void 0 : _b.clinic.find((clinic) => clinic._id == headers.clinic)) === null || _c === void 0 ? void 0 : _c.role) ==
                occupation;
        }))
            return true;
        else
            throw new common_1.UnauthorizedException('guess you have the wrong occupation!');
    }
};
OccupationsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], OccupationsGuard);
exports.OccupationsGuard = OccupationsGuard;
//# sourceMappingURL=occupations.guard.js.map