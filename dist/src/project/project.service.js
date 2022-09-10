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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const project_repository_1 = require("./project.repository");
const component_service_1 = require("../component/component.service");
const task_service_1 = require("../task/task.service");
const project_history_service_1 = require("../project-history/project-history.service");
const attachment_service_1 = require("../attachment/attachment.service");
const finance_service_1 = require("../finance/finance.service");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
const sector_service_1 = require("../sector/sector.service");
const stack_holder_service_1 = require("../stack-holder/stack-holder.service");
let ProjectService = class ProjectService {
    constructor(projectRepo, componentService, taskService, attachmentService, projectHistoryService, financeService, sectorService, stackholderService, errorHandler) {
        this.projectRepo = projectRepo;
        this.componentService = componentService;
        this.taskService = taskService;
        this.attachmentService = attachmentService;
        this.projectHistoryService = projectHistoryService;
        this.financeService = financeService;
        this.sectorService = sectorService;
        this.stackholderService = stackholderService;
        this.errorHandler = errorHandler;
    }
    async createComponents(components, project) {
        for (let index = 0; index < components.length; index++) {
            components[index].project = project.id;
            const sectors = await this.getSectors(components[index].currentComponentSector);
            components[index].sectors = sectors;
            try {
                await this.componentService.create(components[index]);
            }
            catch (error) {
                throw this.errorHandler.badRequest(error);
            }
        }
    }
    async createActivities(activities, createdComponents) {
        for (let index = 0; index < activities.length; index++) {
            let relatedComponentActivity = activities[index];
            for (let j = 0; j < createdComponents.length; j++) {
                if (activities[index].component_name === createdComponents[j].name) {
                    const sectors = await this.getSectors(activities[index].currentActivitySector);
                    activities[index].sectors = sectors;
                    relatedComponentActivity = activities[index];
                    relatedComponentActivity.component = createdComponents[j].id;
                }
            }
            try {
                await this.taskService.create(relatedComponentActivity);
            }
            catch (error) {
                throw this.errorHandler.badRequest(error);
            }
        }
    }
    async createAttachments(attachments, project) {
        for (let index = 0; index < attachments.length; index++) {
            attachments[index].project = project.id;
            try {
                await this.attachmentService.create(attachments[index]);
            }
            catch (error) {
                throw this.errorHandler.badRequest(error);
            }
        }
    }
    async createProjectHistory(history, project) {
        history.project = project.id;
        try {
            await this.projectHistoryService.create(history);
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async createFinance(finance, id) {
        finance.project = id;
        try {
            await this.financeService.create(finance);
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
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
    async getStackHolders(stackHolders) {
        const stackHolderObjs = [];
        for (let index = 0; index < stackHolders.length; index++) {
            try {
                const stackHolder = await this.stackholderService.findOne(stackHolders[index]);
                stackHolderObjs.push(stackHolder);
            }
            catch (error) {
                throw this.errorHandler.badRequest(error);
            }
        }
        return stackHolderObjs;
    }
    async create(createProjectDto) {
        try {
            const stackHolders = await this.getStackHolders(createProjectDto.assignedProjectDonors);
            const sectors = await this.getSectors(createProjectDto.assignedProjectSectors);
            createProjectDto['sectors'] = sectors;
            createProjectDto['stackHolders'] = stackHolders;
            const project = await this.projectRepo.create(createProjectDto);
            const { components, activities, attachments, history, finance } = createProjectDto;
            await this.createComponents(components, project);
            await this.createActivities(activities, components);
            await this.createAttachments(attachments, project);
            await this.createProjectHistory(history, project);
            await this.createFinance(finance, project.id);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.projectRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const project = await this.projectRepo.findOne(id);
        if (!project)
            throw this.errorHandler.notFound();
        return project;
    }
    async update(id, updateProjectDto) {
        const updatedProject = await this.projectRepo.update(id, updateProjectDto);
        if (updatedProject.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async updateSectors(id, updateProjectDto) {
        const sectors = await this.getSectors(updateProjectDto);
        const updatedProject = await this.projectRepo.save(+id, sectors);
        this.componentService.updateComponentsSectors(updatedProject.components, updatedProject.sectors);
        if (updatedProject.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedProject = await this.projectRepo.remove(+id);
        if (deletedProject.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
    async upload(files) {
        return files;
    }
    async count() {
        try {
            return await this.projectRepo.count();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async loans() {
        try {
            return await this.projectRepo.loans();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async grants() {
        try {
            return await this.projectRepo.grants();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_repository_1.ProjectRepo,
        component_service_1.ComponentService,
        task_service_1.TaskService,
        attachment_service_1.AttachmentService,
        project_history_service_1.ProjectHistoryService,
        finance_service_1.FinanceService,
        sector_service_1.SectorService,
        stack_holder_service_1.StackHolderService,
        errorHandler_service_1.ErrorHandler])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map