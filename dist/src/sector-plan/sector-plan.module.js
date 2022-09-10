"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorPlanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sector_plan_service_1 = require("./sector-plan.service");
const sector_plan_controller_1 = require("./sector-plan.controller");
const sector_plan_entity_1 = require("./entities/sector-plan.entity");
const sector_plan_repository_1 = require("./sector-plan.repository");
let SectorPlanModule = class SectorPlanModule {
};
SectorPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sector_plan_entity_1.SectorPlan])],
        controllers: [sector_plan_controller_1.SectorPlanController],
        providers: [sector_plan_service_1.SectorPlanService, sector_plan_repository_1.SectorPlanRepo],
    })
], SectorPlanModule);
exports.SectorPlanModule = SectorPlanModule;
//# sourceMappingURL=sector-plan.module.js.map