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
exports.SectorController = void 0;
const common_1 = require("@nestjs/common");
const sector_service_1 = require("./sector.service");
const create_sector_dto_1 = require("./dto/create-sector.dto");
const update_sector_dto_1 = require("./dto/update-sector.dto");
let SectorController = class SectorController {
    constructor(sectorService) {
        this.sectorService = sectorService;
    }
    create(createSectorDto) {
        return this.sectorService.create(createSectorDto);
    }
    findAll() {
        return this.sectorService.findAll();
    }
    findOne(id) {
        return this.sectorService.findOne(+id);
    }
    update(id, updateSectorDto) {
        return this.sectorService.update(+id, updateSectorDto);
    }
    async remove(id) {
        return this.sectorService.remove(+id);
    }
    findAllProjects(id) {
        return this.sectorService.findAllProjects(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sector_dto_1.CreateSectorDto]),
    __metadata("design:returntype", void 0)
], SectorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SectorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sector_dto_1.UpdateSectorDto]),
    __metadata("design:returntype", void 0)
], SectorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/projects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectorController.prototype, "findAllProjects", null);
SectorController = __decorate([
    (0, common_1.Controller)('sector'),
    __metadata("design:paramtypes", [sector_service_1.SectorService])
], SectorController);
exports.SectorController = SectorController;
//# sourceMappingURL=sector.controller.js.map