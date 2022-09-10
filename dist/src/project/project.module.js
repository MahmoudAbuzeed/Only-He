"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_entity_1 = require("./entities/project.entity");
const component_entity_1 = require("../component/entities/component.entity");
const task_entity_1 = require("../task/entities/task.entity");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const project_repository_1 = require("./project.repository");
const component_service_1 = require("../component/component.service");
const component_repository_1 = require("../component/component.repository");
const task_service_1 = require("../task/task.service");
const task_repository_1 = require("../task/task.repository");
const attachment_entity_1 = require("../attachment/entities/attachment.entity");
const attachment_service_1 = require("../attachment/attachment.service");
const attachment_repository_1 = require("../attachment/attachment.repository");
const project_history_service_1 = require("../project-history/project-history.service");
const project_history_entity_1 = require("../project-history/entities/project-history.entity");
const project_history_repository_1 = require("../project-history/project-history.repository");
const finance_service_1 = require("../finance/finance.service");
const finance_entity_1 = require("../finance/entities/finance.entity");
const finance_repository_1 = require("../finance/finance.repository");
const sector_service_1 = require("../sector/sector.service");
const sector_repository_1 = require("../sector/sector.repository");
const sector_entity_1 = require("../sector/entities/sector.entity");
const stack_holder_entity_1 = require("../stack-holder/entities/stack-holder.entity");
const stack_holder_repository_1 = require("../stack-holder/stack-holder.repository");
const stack_holder_service_1 = require("../stack-holder/stack-holder.service");
let ProjectModule = class ProjectModule {
};
ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                component_entity_1.Component,
                task_entity_1.Task,
                attachment_entity_1.Attachment,
                project_history_entity_1.ProjectHistory,
                finance_entity_1.Finance,
                sector_entity_1.Sector,
                stack_holder_entity_1.StackHolder,
            ]),
        ],
        controllers: [project_controller_1.ProjectController],
        providers: [
            project_service_1.ProjectService,
            project_repository_1.ProjectRepo,
            component_service_1.ComponentService,
            component_repository_1.ComponentRepo,
            task_service_1.TaskService,
            task_repository_1.TaskRepo,
            attachment_service_1.AttachmentService,
            attachment_repository_1.AttachmentRepo,
            project_history_service_1.ProjectHistoryService,
            project_history_repository_1.ProjectHistoryRepo,
            finance_repository_1.FinanceRepo,
            finance_service_1.FinanceService,
            sector_service_1.SectorService,
            sector_repository_1.SectorRepo,
            stack_holder_repository_1.StackHolderRepo,
            stack_holder_service_1.StackHolderService,
        ],
    })
], ProjectModule);
exports.ProjectModule = ProjectModule;
//# sourceMappingURL=project.module.js.map