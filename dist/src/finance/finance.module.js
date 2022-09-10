"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finance_service_1 = require("./finance.service");
const finance_controller_1 = require("./finance.controller");
const finance_entity_1 = require("./entities/finance.entity");
const finance_repository_1 = require("./finance.repository");
let FinanceModule = class FinanceModule {
};
FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([finance_entity_1.Finance])],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService, finance_repository_1.FinanceRepo],
    })
], FinanceModule);
exports.FinanceModule = FinanceModule;
//# sourceMappingURL=finance.module.js.map