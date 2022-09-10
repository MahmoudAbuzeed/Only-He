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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const task_repository_1 = require("./task.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
const sector_service_1 = require("../sector/sector.service");
let TaskService = class TaskService {
    constructor(taskRepo, errorHandler, sectorService) {
        this.taskRepo = taskRepo;
        this.errorHandler = errorHandler;
        this.sectorService = sectorService;
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
    async create(createTaskDto) {
        try {
            await this.taskRepo.create(createTaskDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.taskRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const task = await this.taskRepo.findOne(id);
        if (!task)
            throw this.errorHandler.notFound();
        return task;
    }
    async update(id, updateTaskDto) {
        const updatedTask = await this.taskRepo.update(id, updateTaskDto);
        if (updatedTask.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async updateComponentSectors(id, updateTaskDto) {
        const sectors = await this.getSectors(updateTaskDto);
        const task = await this.findOne(id);
        task.sectors = sectors;
        const updatedTask = await this.taskRepo.updateTaskSectors(task);
        if (updatedTask.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async updateActivitiesSectors(tasks, sectors) {
        for (let index = 0; index < tasks.length; index++) {
            const task = await this.findOne(tasks[index].id);
            task.sectors = sectors;
            const updatedSector = await this.taskRepo.updateTaskSectors(task);
            if (updatedSector.affected == 0)
                throw this.errorHandler.notFound();
        }
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedTask = await this.taskRepo.remove(+id);
        if (deletedTask.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [task_repository_1.TaskRepo,
        errorHandler_service_1.ErrorHandler,
        sector_service_1.SectorService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map