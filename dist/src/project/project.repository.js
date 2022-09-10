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
exports.ProjectRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const component_entity_1 = require("../component/entities/component.entity");
const attachment_entity_1 = require("../attachment/entities/attachment.entity");
const finance_entity_1 = require("../finance/entities/finance.entity");
let ProjectRepo = class ProjectRepo {
    constructor(projectRepository, componentRepository, attachmentRepository, financeRepository) {
        this.projectRepository = projectRepository;
        this.componentRepository = componentRepository;
        this.attachmentRepository = attachmentRepository;
        this.financeRepository = financeRepository;
    }
    async create(createProjectDto) {
        return await this.projectRepository.save(createProjectDto);
    }
    async findAll() {
        return await this.projectRepository.find();
    }
    async findOne(id) {
        const components = await this.componentRepository.find({
            where: { project: id },
        });
        const attachments = await this.attachmentRepository.find({
            where: { project: id },
        });
        const finance = await this.financeRepository.find({
            where: { project: id },
        });
        const project = await this.projectRepository.findOne(id, {
            relations: ['sectors'],
        });
        project.components = components;
        project.attachments = attachments;
        project.finance = finance[0];
        return project;
    }
    async update(id, updateProjectDto) {
        return await this.projectRepository.update(id, updateProjectDto);
    }
    async save(id, updateProjectDto) {
        const project = await this.findOne(id);
        project.sectors = updateProjectDto;
        return await this.projectRepository.save(project);
    }
    async remove(id) {
        return await this.projectRepository.delete({ id });
    }
    async count() {
        return await this.projectRepository.count();
    }
    async loans() {
        return await this.projectRepository
            .createQueryBuilder('project')
            .select('SUM(project.budget)', 'sum')
            .where("project.type = 'loan' ")
            .getRawOne();
    }
    async grants() {
        return await this.projectRepository
            .createQueryBuilder('project')
            .select('SUM(project.budget)', 'sum')
            .where("project.type = 'grant' ")
            .getRawOne();
    }
};
ProjectRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(component_entity_1.Component)),
    __param(2, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __param(3, (0, typeorm_1.InjectRepository)(finance_entity_1.Finance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectRepo);
exports.ProjectRepo = ProjectRepo;
//# sourceMappingURL=project.repository.js.map