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
exports.TaskRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
let TaskRepo = class TaskRepo {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async create(createTaskDto) {
        return await this.taskRepository.save(createTaskDto);
    }
    async findAll() {
        return await this.taskRepository.find();
    }
    async findOne(id) {
        return await this.taskRepository.findOne(id, { relations: ['sectors'] });
    }
    async update(id, updateTaskDto) {
        return await this.taskRepository.update(id, updateTaskDto);
    }
    async updateTaskSectors(updateComponentDto) {
        return await this.taskRepository.save(updateComponentDto);
    }
    async remove(id) {
        return await this.taskRepository.delete({ id });
    }
};
TaskRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskRepo);
exports.TaskRepo = TaskRepo;
//# sourceMappingURL=task.repository.js.map