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
exports.SectorGoalRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const sector_goal_entity_1 = require("./entities/sector-goal.entity");
let SectorGoalRepo = class SectorGoalRepo {
    constructor(sectorGoalRepository) {
        this.sectorGoalRepository = sectorGoalRepository;
    }
    async create(createSectorGoalDto) {
        return await this.sectorGoalRepository.save(createSectorGoalDto);
    }
    async findAll() {
        return await this.sectorGoalRepository.find();
    }
    async findOne(id) {
        return await this.sectorGoalRepository.findOne(id);
    }
    async update(id, updateSectorGoalDto) {
        return await this.sectorGoalRepository.update(id, updateSectorGoalDto);
    }
    async remove(id) {
        return await this.sectorGoalRepository.delete({ id });
    }
};
SectorGoalRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sector_goal_entity_1.SectorGoal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SectorGoalRepo);
exports.SectorGoalRepo = SectorGoalRepo;
//# sourceMappingURL=sector-goal.repository.js.map