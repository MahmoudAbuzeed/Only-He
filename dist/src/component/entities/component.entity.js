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
exports.Component = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("../../project/entities/project.entity");
const sector_entity_1 = require("../../sector/entities/sector.entity");
const stack_holder_entity_1 = require("../../stack-holder/entities/stack-holder.entity");
let Component = class Component {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Component.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], Component.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], Component.prototype, "reference_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Component.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], Component.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Component.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Component.prototype, "approval_requirements", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Component.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Component.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Component.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Component.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Component.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project),
    __metadata("design:type", project_entity_1.Project)
], Component.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => sector_entity_1.Sector, (sector) => sector.components, {
        eager: false,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Component.prototype, "sectors", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => stack_holder_entity_1.StackHolder, (stackHolders) => stackHolders.components, {
        eager: false,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Component.prototype, "stackHolders", void 0);
Component = __decorate([
    (0, typeorm_1.Entity)()
], Component);
exports.Component = Component;
//# sourceMappingURL=component.entity.js.map