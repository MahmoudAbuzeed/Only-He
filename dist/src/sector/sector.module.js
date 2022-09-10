"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sector_service_1 = require("./sector.service");
const sector_controller_1 = require("./sector.controller");
const sector_entity_1 = require("./entities/sector.entity");
const sector_repository_1 = require("./sector.repository");
let SectorModule = class SectorModule {
};
SectorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sector_entity_1.Sector])],
        controllers: [sector_controller_1.SectorController],
        providers: [sector_service_1.SectorService, sector_repository_1.SectorRepo],
    })
], SectorModule);
exports.SectorModule = SectorModule;
//# sourceMappingURL=sector.module.js.map