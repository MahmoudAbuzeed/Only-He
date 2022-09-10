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
exports.TaskReferenceController = void 0;
const common_1 = require("@nestjs/common");
const task_reference_service_1 = require("./task-reference.service");
const create_task_reference_dto_1 = require("./dto/create-task-reference.dto");
const update_task_reference_dto_1 = require("./dto/update-task-reference.dto");
let TaskReferenceController = class TaskReferenceController {
    constructor(taskReferenceService) {
        this.taskReferenceService = taskReferenceService;
    }
    create(createTaskReferenceDto) {
        return this.taskReferenceService.create(createTaskReferenceDto);
    }
    findAll() {
        return this.taskReferenceService.findAll();
    }
    findOne(id) {
        return this.taskReferenceService.findOne(+id);
    }
    update(id, updateTaskReferenceDto) {
        return this.taskReferenceService.update(+id, updateTaskReferenceDto);
    }
    remove(id) {
        return this.taskReferenceService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_reference_dto_1.CreateTaskReferenceDto]),
    __metadata("design:returntype", void 0)
], TaskReferenceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskReferenceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskReferenceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_reference_dto_1.UpdateTaskReferenceDto]),
    __metadata("design:returntype", void 0)
], TaskReferenceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskReferenceController.prototype, "remove", null);
TaskReferenceController = __decorate([
    (0, common_1.Controller)('task-reference'),
    __metadata("design:paramtypes", [task_reference_service_1.TaskReferenceService])
], TaskReferenceController);
exports.TaskReferenceController = TaskReferenceController;
//# sourceMappingURL=task-reference.controller.js.map