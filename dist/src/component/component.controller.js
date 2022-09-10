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
exports.ComponentController = void 0;
const common_1 = require("@nestjs/common");
const component_service_1 = require("./component.service");
const create_component_dto_1 = require("./dto/create-component.dto");
const update_component_dto_1 = require("./dto/update-component.dto");
let ComponentController = class ComponentController {
    constructor(componentService) {
        this.componentService = componentService;
    }
    create(createComponentDto) {
        createComponentDto.start_date = new Date(createComponentDto.start_date);
        createComponentDto.start_date = new Date(createComponentDto.start_date);
        return this.componentService.create(createComponentDto);
    }
    findAll() {
        return this.componentService.findAll();
    }
    findOne(id) {
        return this.componentService.findOne(+id);
    }
    update(id, updateComponentDto) {
        updateComponentDto.start_date = new Date(updateComponentDto.start_date);
        updateComponentDto.start_date = new Date(updateComponentDto.start_date);
        return this.componentService.update(+id, updateComponentDto);
    }
    updateSectors(id, updateComponentDto) {
        return this.componentService.updateComponentSectors(+id, updateComponentDto);
    }
    remove(id) {
        return this.componentService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_component_dto_1.CreateComponentDto]),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_component_dto_1.UpdateComponentDto]),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('sectors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "updateSectors", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComponentController.prototype, "remove", null);
ComponentController = __decorate([
    (0, common_1.Controller)('component'),
    __metadata("design:paramtypes", [component_service_1.ComponentService])
], ComponentController);
exports.ComponentController = ComponentController;
//# sourceMappingURL=component.controller.js.map