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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const role_repository_1 = require("./role.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
const custom_error_1 = require("../../shared/custom-error/custom-error");
let RoleService = class RoleService {
    constructor(roleRepo, errorHandler) {
        this.roleRepo = roleRepo;
        this.errorHandler = errorHandler;
    }
    async create(createRoleDto) {
        try {
            return await this.roleRepo.create(createRoleDto);
        }
        catch (error) {
            throw new custom_error_1.CustomError(400, error.message);
        }
    }
    async findAll() {
        return await this.roleRepo.findAll();
    }
    async findOne(id) {
        const role = await this.roleRepo.findOne(id);
        if (!role)
            throw new custom_error_1.CustomError(401, "Role Not Found");
        return role;
    }
    async update(id, updateRoleDto) {
        const updatedRole = await this.roleRepo.update(id, updateRoleDto);
        if (updatedRole.affected == 0)
            throw new custom_error_1.CustomError(401, "Role Not Found");
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedRole = await this.roleRepo.remove(+id);
        if (deletedRole.affected == 0)
            throw new custom_error_1.CustomError(401, "Role Not Found");
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_repository_1.RoleRepo, errorHandler_service_1.ErrorHandler])
], RoleService);
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map