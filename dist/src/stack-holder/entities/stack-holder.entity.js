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
exports.StackHolder = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("../../project/entities/project.entity");
const component_entity_1 = require("../../component/entities/component.entity");
const task_entity_1 = require("../../task/entities/task.entity");
let StackHolder = class StackHolder {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StackHolder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], StackHolder.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], StackHolder.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], StackHolder.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StackHolder.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StackHolder.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => project_entity_1.Project, (project) => project.stackHolders, {
        eager: false,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], StackHolder.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => component_entity_1.Component, (component) => component.stackHolders, {
        eager: false,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], StackHolder.prototype, "components", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => task_entity_1.Task, (task) => task.stackHolders, {
        eager: false,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], StackHolder.prototype, "tasks", void 0);
StackHolder = __decorate([
    (0, typeorm_1.Entity)()
], StackHolder);
exports.StackHolder = StackHolder;
//# sourceMappingURL=stack-holder.entity.js.map