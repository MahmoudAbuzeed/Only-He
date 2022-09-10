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
exports.ProjectHistoryService = void 0;
const common_1 = require("@nestjs/common");
const project_history_repository_1 = require("./project-history.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let ProjectHistoryService = class ProjectHistoryService {
    constructor(projectHistoryRepo, errorHandler) {
        this.projectHistoryRepo = projectHistoryRepo;
        this.errorHandler = errorHandler;
    }
    async create(createProjectHistoryDto) {
        try {
            await this.projectHistoryRepo.create(createProjectHistoryDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.projectHistoryRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const project = await this.projectHistoryRepo.findOne(id);
        if (!project)
            throw this.errorHandler.notFound();
        return project;
    }
    async update(id, updateProjectHistoryDto) {
        const updatedProjectHistory = await this.projectHistoryRepo.update(id, updateProjectHistoryDto);
        if (updatedProjectHistory.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedProjectHistory = await this.projectHistoryRepo.remove(+id);
        if (deletedProjectHistory.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
ProjectHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_history_repository_1.ProjectHistoryRepo,
        errorHandler_service_1.ErrorHandler])
], ProjectHistoryService);
exports.ProjectHistoryService = ProjectHistoryService;
//# sourceMappingURL=project-history.service.js.map