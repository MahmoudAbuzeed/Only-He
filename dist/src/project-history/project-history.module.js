"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_history_service_1 = require("./project-history.service");
const project_history_controller_1 = require("./project-history.controller");
const project_history_entity_1 = require("./entities/project-history.entity");
const project_history_repository_1 = require("./project-history.repository");
let ProjectHistoryModule = class ProjectHistoryModule {
};
ProjectHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_history_entity_1.ProjectHistory])],
        controllers: [project_history_controller_1.ProjectHistoryController],
        providers: [project_history_service_1.ProjectHistoryService, project_history_repository_1.ProjectHistoryRepo],
    })
], ProjectHistoryModule);
exports.ProjectHistoryModule = ProjectHistoryModule;
//# sourceMappingURL=project-history.module.js.map