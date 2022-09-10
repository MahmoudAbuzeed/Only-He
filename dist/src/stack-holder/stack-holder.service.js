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
exports.StackHolderService = void 0;
const common_1 = require("@nestjs/common");
const stack_holder_repository_1 = require("./stack-holder.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let StackHolderService = class StackHolderService {
    constructor(stackHolderRepo, errorHandler) {
        this.stackHolderRepo = stackHolderRepo;
        this.errorHandler = errorHandler;
    }
    async create(createStackHolderDto) {
        try {
            await this.stackHolderRepo.create(createStackHolderDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            const initialValue = 0;
            const stackHolders = await this.stackHolderRepo.findAll();
            stackHolders.forEach((stackHolder) => stackHolder.projects.reduce((previousValue, currentValue) => {
                const sum = previousValue + currentValue.budget;
                stackHolder['sum'] = sum;
                return sum;
            }, initialValue));
            return stackHolders;
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const stackHolder = await this.stackHolderRepo.findOne(id);
        if (!stackHolder)
            throw this.errorHandler.notFound();
        return stackHolder;
    }
    async update(id, updateStackHolderDto) {
        const updatedStackHolder = await this.stackHolderRepo.update(id, updateStackHolderDto);
        if (updatedStackHolder.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedStackHolder = await this.stackHolderRepo.remove(+id);
        if (deletedStackHolder.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
    async findAllProjects(stackHolderId) {
        try {
            const stackHolders = (await this.stackHolderRepo.findAllProjects(stackHolderId));
            const result = stackHolders.map((stackHolder) => stackHolder.projects);
            return result.flat();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
};
StackHolderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stack_holder_repository_1.StackHolderRepo,
        errorHandler_service_1.ErrorHandler])
], StackHolderService);
exports.StackHolderService = StackHolderService;
//# sourceMappingURL=stack-holder.service.js.map