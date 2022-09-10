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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorPlanController = void 0;
const common_1 = require("@nestjs/common");
const sector_plan_service_1 = require("./sector-plan.service");
const create_sector_plan_dto_1 = require("./dto/create-sector-plan.dto");
const update_sector_plan_dto_1 = require("./dto/update-sector-plan.dto");
let SectorPlanController = class SectorPlanController {
    constructor(sectorPlanService) {
        this.sectorPlanService = sectorPlanService;
    }
    create(createSectorPlanDto) {
        createSectorPlanDto.start_date = new Date(createSectorPlanDto.start_date);
        createSectorPlanDto.start_date = new Date(createSectorPlanDto.start_date);
        return this.sectorPlanService.create(createSectorPlanDto);
    }
    findAll() {
        return this.sectorPlanService.findAll();
    }
    findOne(id) {
        return this.sectorPlanService.findOne(+id);
    }
    update(id, updateSectorPlanDto) {
        updateSectorPlanDto.start_date = new Date(updateSectorPlanDto.start_date);
        updateSectorPlanDto.start_date = new Date(updateSectorPlanDto.start_date);
        return this.sectorPlanService.update(+id, updateSectorPlanDto);
    }
    remove(id) {
        return this.sectorPlanService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sector_plan_dto_1.CreateSectorPlanDto]),
    __metadata("design:returntype", void 0)
], SectorPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SectorPlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sector_plan_dto_1.UpdateSectorPlanDto]),
    __metadata("design:returntype", void 0)
], SectorPlanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorPlanController.prototype, "remove", null);
SectorPlanController = __decorate([
    (0, common_1.Controller)('sector-plan'),
    __metadata("design:paramtypes", [sector_plan_service_1.SectorPlanService])
], SectorPlanController);
exports.SectorPlanController = SectorPlanController;
//# sourceMappingURL=sector-plan.controller.js.map