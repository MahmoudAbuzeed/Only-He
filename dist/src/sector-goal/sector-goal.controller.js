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
exports.SectorGoalController = void 0;
const common_1 = require("@nestjs/common");
const sector_goal_service_1 = require("./sector-goal.service");
const create_sector_goal_dto_1 = require("./dto/create-sector-goal.dto");
const update_sector_goal_dto_1 = require("./dto/update-sector-goal.dto");
let SectorGoalController = class SectorGoalController {
    constructor(sectorGoalService) {
        this.sectorGoalService = sectorGoalService;
    }
    create(createSectorGoalDto) {
        return this.sectorGoalService.create(createSectorGoalDto);
    }
    findAll() {
        return this.sectorGoalService.findAll();
    }
    findOne(id) {
        return this.sectorGoalService.findOne(+id);
    }
    update(id, updateSectorGoalDto) {
        return this.sectorGoalService.update(+id, updateSectorGoalDto);
    }
    remove(id) {
        return this.sectorGoalService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sector_goal_dto_1.CreateSectorGoalDto]),
    __metadata("design:returntype", void 0)
], SectorGoalController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SectorGoalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorGoalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sector_goal_dto_1.UpdateSectorGoalDto]),
    __metadata("design:returntype", void 0)
], SectorGoalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorGoalController.prototype, "remove", null);
SectorGoalController = __decorate([
    (0, common_1.Controller)('sector-goal'),
    __metadata("design:paramtypes", [sector_goal_service_1.SectorGoalService])
], SectorGoalController);
exports.SectorGoalController = SectorGoalController;
//# sourceMappingURL=sector-goal.controller.js.map