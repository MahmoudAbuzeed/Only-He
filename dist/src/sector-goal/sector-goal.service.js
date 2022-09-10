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
exports.SectorGoalService = void 0;
const common_1 = require("@nestjs/common");
const sector_goal_repository_1 = require("./sector-goal.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let SectorGoalService = class SectorGoalService {
    constructor(sectorGoalRepo, errorHandler) {
        this.sectorGoalRepo = sectorGoalRepo;
        this.errorHandler = errorHandler;
    }
    async create(createSectorGoalDto) {
        try {
            await this.sectorGoalRepo.create(createSectorGoalDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.sectorGoalRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const sectorGoal = await this.sectorGoalRepo.findOne(id);
        if (!sectorGoal)
            throw this.errorHandler.notFound();
        return sectorGoal;
    }
    async update(id, updateSectorGoalDto) {
        const updatedGoal = await this.sectorGoalRepo.update(id, updateSectorGoalDto);
        if (updatedGoal.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedGoal = await this.sectorGoalRepo.remove(+id);
        if (deletedGoal.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
SectorGoalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sector_goal_repository_1.SectorGoalRepo,
        errorHandler_service_1.ErrorHandler])
], SectorGoalService);
exports.SectorGoalService = SectorGoalService;
//# sourceMappingURL=sector-goal.service.js.map