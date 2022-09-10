"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectObjectiveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_objective_controller_1 = require("./project-objective.controller");
const project_objective_entity_1 = require("./entities/project-objective.entity");
const project_objective_service_1 = require("./project-objective.service");
const project_objective_repository_1 = require("./project-objective.repository");
let ProjectObjectiveModule = class ProjectObjectiveModule {
};
ProjectObjectiveModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_objective_entity_1.ProjectObjective])],
        controllers: [project_objective_controller_1.ProjectObjectiveController],
        providers: [project_objective_service_1.ProjectObjectiveService, project_objective_repository_1.ProjectObjectiveRepo],
    })
], ProjectObjectiveModule);
exports.ProjectObjectiveModule = ProjectObjectiveModule;
//# sourceMappingURL=project-objective.module.js.map