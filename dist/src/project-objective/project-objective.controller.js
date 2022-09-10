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
exports.ProjectObjectiveController = void 0;
const common_1 = require("@nestjs/common");
const project_objective_service_1 = require("./project-objective.service");
const create_project_objective_dto_1 = require("./dto/create-project-objective.dto");
const update_project_objective_dto_1 = require("./dto/update-project-objective.dto");
let ProjectObjectiveController = class ProjectObjectiveController {
    constructor(projectObjectiveService) {
        this.projectObjectiveService = projectObjectiveService;
    }
    create(createProjectObjectiveDto) {
        return this.projectObjectiveService.create(createProjectObjectiveDto);
    }
    findAll() {
        return this.projectObjectiveService.findAll();
    }
    findOne(id) {
        return this.projectObjectiveService.findOne(+id);
    }
    update(id, updateProjectObjectiveDto) {
        return this.projectObjectiveService.update(+id, updateProjectObjectiveDto);
    }
    remove(id) {
        return this.projectObjectiveService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_objective_dto_1.CreateProjectObjectiveDto]),
    __metadata("design:returntype", void 0)
], ProjectObjectiveController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectObjectiveController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectObjectiveController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_objective_dto_1.UpdateProjectObjectiveDto]),
    __metadata("design:returntype", void 0)
], ProjectObjectiveController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectObjectiveController.prototype, "remove", null);
ProjectObjectiveController = __decorate([
    (0, common_1.Controller)('project-objective'),
    __metadata("design:paramtypes", [project_objective_service_1.ProjectObjectiveService])
], ProjectObjectiveController);
exports.ProjectObjectiveController = ProjectObjectiveController;
//# sourceMappingURL=project-objective.controller.js.map