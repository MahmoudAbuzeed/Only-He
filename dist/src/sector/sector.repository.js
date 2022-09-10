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
exports.SectorRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const sector_entity_1 = require("./entities/sector.entity");
let SectorRepo = class SectorRepo {
    constructor(sectorRepository) {
        this.sectorRepository = sectorRepository;
    }
    async create(createSectorDto) {
        return await this.sectorRepository.save(createSectorDto);
    }
    async findAll() {
        return await this.sectorRepository.find();
    }
    async findOne(id) {
        return await this.sectorRepository.findOne(id);
    }
    async update(id, updateSectorDto) {
        return await this.sectorRepository.update(id, updateSectorDto);
    }
    async remove(id) {
        return await this.sectorRepository.delete({ id });
    }
    async findAllProjects(sectorId) {
        return await this.sectorRepository.find({
            relations: ['projects'],
            where: { id: sectorId },
        });
    }
};
SectorRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sector_entity_1.Sector)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SectorRepo);
exports.SectorRepo = SectorRepo;
//# sourceMappingURL=sector.repository.js.map