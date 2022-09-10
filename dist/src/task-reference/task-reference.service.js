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
exports.TaskReferenceService = void 0;
const common_1 = require("@nestjs/common");
const task_reference_repository_1 = require("./task-reference.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let TaskReferenceService = class TaskReferenceService {
    constructor(taskReferenceRepo, errorHandler) {
        this.taskReferenceRepo = taskReferenceRepo;
        this.errorHandler = errorHandler;
    }
    async create(createTaskReferenceDto) {
        try {
            await this.taskReferenceRepo.create(createTaskReferenceDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.taskReferenceRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const taskRef = await this.taskReferenceRepo.findOne(id);
        if (!taskRef)
            throw this.errorHandler.notFound();
        return taskRef;
    }
    async update(id, updateTaskReferenceDto) {
        const updatedTaskRef = await this.taskReferenceRepo.update(id, updateTaskReferenceDto);
        if (updatedTaskRef.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedAttachment = await this.taskReferenceRepo.remove(+id);
        if (deletedAttachment.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
TaskReferenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [task_reference_repository_1.TaskReferenceRepo,
        errorHandler_service_1.ErrorHandler])
], TaskReferenceService);
exports.TaskReferenceService = TaskReferenceService;
//# sourceMappingURL=task-reference.service.js.map