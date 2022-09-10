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
exports.SectorPlanService = void 0;
const common_1 = require("@nestjs/common");
const sector_plan_repository_1 = require("./sector-plan.repository");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const messages_1 = require("../../messages");
let SectorPlanService = class SectorPlanService {
    constructor(sectorPlanRepo, errorHandler) {
        this.sectorPlanRepo = sectorPlanRepo;
        this.errorHandler = errorHandler;
    }
    async create(createSectorPlanDto) {
        try {
            await this.sectorPlanRepo.create(createSectorPlanDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.sectorPlanRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const sectorPlan = await this.sectorPlanRepo.findOne(id);
        if (!sectorPlan)
            throw this.errorHandler.notFound();
        return sectorPlan;
    }
    async update(id, updateSectorPlanDto) {
        const updatedPlan = await this.sectorPlanRepo.update(id, updateSectorPlanDto);
        if (updatedPlan.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedPlane = await this.sectorPlanRepo.remove(+id);
        if (deletedPlane.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
SectorPlanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sector_plan_repository_1.SectorPlanRepo,
        errorHandler_service_1.ErrorHandler])
], SectorPlanService);
exports.SectorPlanService = SectorPlanService;
//# sourceMappingURL=sector-plan.service.js.map