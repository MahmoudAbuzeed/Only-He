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
exports.SectorGoal = void 0;
const typeorm_1 = require("typeorm");
const sector_plan_entity_1 = require("../../sector-plan/entities/sector-plan.entity");
let SectorGoal = class SectorGoal {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SectorGoal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], SectorGoal.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], SectorGoal.prototype, "pillars", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SectorGoal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], SectorGoal.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SectorGoal.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SectorGoal.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SectorGoal.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SectorGoal.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sector_plan_entity_1.SectorPlan),
    __metadata("design:type", sector_plan_entity_1.SectorPlan)
], SectorGoal.prototype, "sectorPlan", void 0);
SectorGoal = __decorate([
    (0, typeorm_1.Entity)()
], SectorGoal);
exports.SectorGoal = SectorGoal;
//# sourceMappingURL=sector-goal.entity.js.map