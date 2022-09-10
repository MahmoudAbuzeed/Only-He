"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const errorHandler_service_1 = require("./errorHandler.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./auth/constants");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./guard/jwt-auth.guard");
const roles_guard_1 = require("./guard/roles.guard");
const occupations_guard_1 = require("./guard/occupations.guard");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
            }),
        ],
        providers: [
            errorHandler_service_1.ErrorHandler,
            jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: occupations_guard_1.OccupationsGuard,
            },
        ],
        exports: [errorHandler_service_1.ErrorHandler, jwt_1.JwtModule, jwt_strategy_1.JwtStrategy],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map