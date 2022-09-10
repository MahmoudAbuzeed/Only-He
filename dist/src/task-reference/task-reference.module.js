"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskReferenceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_reference_service_1 = require("./task-reference.service");
const task_reference_controller_1 = require("./task-reference.controller");
const task_reference_entity_1 = require("./entities/task-reference.entity");
const task_reference_repository_1 = require("./task-reference.repository");
let TaskReferenceModule = class TaskReferenceModule {
};
TaskReferenceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_reference_entity_1.TaskReference])],
        controllers: [task_reference_controller_1.TaskReferenceController],
        providers: [task_reference_service_1.TaskReferenceService, task_reference_repository_1.TaskReferenceRepo],
    })
], TaskReferenceModule);
exports.TaskReferenceModule = TaskReferenceModule;
//# sourceMappingURL=task-reference.module.js.map