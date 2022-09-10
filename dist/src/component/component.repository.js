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
exports.ComponentRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const component_entity_1 = require("./entities/component.entity");
const task_entity_1 = require("../task/entities/task.entity");
let ComponentRepo = class ComponentRepo {
    constructor(component, taskRepository) {
        this.component = component;
        this.taskRepository = taskRepository;
    }
    async create(createComponentDto) {
        return await this.component.save(createComponentDto);
    }
    async findAll() {
        return await this.component.find();
    }
    async findOne(id) {
        const activities = await this.taskRepository.find({
            where: { component: id },
        });
        const component = await this.component.findOne(id, {
            relations: ['sectors'],
        });
        component.activities = activities;
        return component;
    }
    async update(id, updateComponentDto) {
        return await this.component.update(id, updateComponentDto);
    }
    async updateComponentSectors(updateComponentDto) {
        return await this.component.save(updateComponentDto);
    }
    async remove(id) {
        return await this.component.delete({ id });
    }
};
ComponentRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(component_entity_1.Component)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ComponentRepo);
exports.ComponentRepo = ComponentRepo;
//# sourceMappingURL=component.repository.js.map