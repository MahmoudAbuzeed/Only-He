"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const component_service_1 = require("./component.service");
const component_controller_1 = require("./component.controller");
const component_entity_1 = require("./entities/component.entity");
const component_repository_1 = require("./component.repository");
const task_entity_1 = require("../task/entities/task.entity");
const sector_entity_1 = require("../sector/entities/sector.entity");
const sector_service_1 = require("../sector/sector.service");
const sector_repository_1 = require("../sector/sector.repository");
const task_service_1 = require("../task/task.service");
const task_repository_1 = require("../task/task.repository");
let ComponentModule = class ComponentModule {
};
ComponentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([component_entity_1.Component, task_entity_1.Task, sector_entity_1.Sector])],
        controllers: [component_controller_1.ComponentController],
        providers: [
            component_service_1.ComponentService,
            component_repository_1.ComponentRepo,
            sector_service_1.SectorService,
            sector_repository_1.SectorRepo,
            task_service_1.TaskService,
            task_repository_1.TaskRepo,
        ],
    })
], ComponentModule);
exports.ComponentModule = ComponentModule;
//# sourceMappingURL=component.module.js.map