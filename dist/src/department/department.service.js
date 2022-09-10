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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const department_repository_1 = require("./department.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let DepartmentService = class DepartmentService {
    constructor(departmentRepo, errorHandler) {
        this.departmentRepo = departmentRepo;
        this.errorHandler = errorHandler;
    }
    async create(createDepartmentDto) {
        try {
            await this.departmentRepo.create(createDepartmentDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.departmentRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const department = await this.departmentRepo.findOne(id);
        if (!department)
            throw this.errorHandler.notFound();
        return department;
    }
    async update(id, updateDepartmentDto) {
        const updatedDepartment = await this.departmentRepo.update(id, updateDepartmentDto);
        if (updatedDepartment.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedDepartment = await this.departmentRepo.remove(+id);
        if (deletedDepartment.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [department_repository_1.DepartmentRepo,
        errorHandler_service_1.ErrorHandler])
], DepartmentService);
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=department.service.js.map