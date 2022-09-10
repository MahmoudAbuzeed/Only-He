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
exports.ComponentService = void 0;
const common_1 = require("@nestjs/common");
const component_repository_1 = require("./component.repository");
const messages_1 = require("../../messages");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const sector_service_1 = require("../sector/sector.service");
const task_service_1 = require("../task/task.service");
let ComponentService = class ComponentService {
    constructor(componentRepo, errorHandler, sectorService, taskService) {
        this.componentRepo = componentRepo;
        this.errorHandler = errorHandler;
        this.sectorService = sectorService;
        this.taskService = taskService;
    }
    async getSectors(sectors) {
        const sectorObjs = [];
        for (let index = 0; index < sectors.length; index++) {
            try {
                const sector = await this.sectorService.findOne(sectors[index]);
                sectorObjs.push(sector);
            }
            catch (error) {
                throw this.errorHandler.badRequest(error);
            }
        }
        return sectorObjs;
    }
    async create(createComponentDto) {
        try {
            await this.componentRepo.create(createComponentDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.componentRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const component = await this.componentRepo.findOne(id);
        if (!component)
            throw this.errorHandler.notFound();
        return component;
    }
    async update(id, updateComponentDto) {
        const updatedComponent = await this.componentRepo.update(id, updateComponentDto);
        if (updatedComponent.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async updateComponentSectors(id, updateComponentDto) {
        const sectors = await this.getSectors(updateComponentDto);
        const component = await this.findOne(id);
        component.sectors = sectors;
        const updatedComponent = await this.componentRepo.updateComponentSectors(component);
        this.taskService.updateActivitiesSectors(updatedComponent.activities, updatedComponent.sectors);
        if (updatedComponent.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async updateComponentsSectors(components, sectors) {
        for (let index = 0; index < components.length; index++) {
            const component = await this.findOne(components[index].id);
            component.sectors = sectors;
            const updatedComponent = await this.componentRepo.updateComponentSectors(component);
            this.taskService.updateActivitiesSectors(updatedComponent.activities, updatedComponent.sectors);
            if (updatedComponent.affected == 0)
                throw this.errorHandler.notFound();
        }
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedComponent = await this.componentRepo.remove(+id);
        if (deletedComponent.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
ComponentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [component_repository_1.ComponentRepo,
        errorHandler_service_1.ErrorHandler,
        sector_service_1.SectorService,
        task_service_1.TaskService])
], ComponentService);
exports.ComponentService = ComponentService;
//# sourceMappingURL=component.service.js.map