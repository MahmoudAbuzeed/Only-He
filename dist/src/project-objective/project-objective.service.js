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
exports.ProjectObjectiveService = void 0;
const common_1 = require("@nestjs/common");
const project_objective_repository_1 = require("./project-objective.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let ProjectObjectiveService = class ProjectObjectiveService {
    constructor(projectObjectiveRepo, errorHandler) {
        this.projectObjectiveRepo = projectObjectiveRepo;
        this.errorHandler = errorHandler;
    }
    async create(createProjectObjectiveDto) {
        try {
            await this.projectObjectiveRepo.create(createProjectObjectiveDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.projectObjectiveRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const projectObjective = await this.projectObjectiveRepo.findOne(id);
        if (!projectObjective)
            throw this.errorHandler.notFound();
        return projectObjective;
    }
    async update(id, updateProjectObjectiveDto) {
        const updatedObjective = await this.projectObjectiveRepo.update(id, updateProjectObjectiveDto);
        if (updatedObjective.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedObjective = await this.projectObjectiveRepo.remove(+id);
        if (deletedObjective.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
ProjectObjectiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_objective_repository_1.ProjectObjectiveRepo,
        errorHandler_service_1.ErrorHandler])
], ProjectObjectiveService);
exports.ProjectObjectiveService = ProjectObjectiveService;
//# sourceMappingURL=project-objective.service.js.map