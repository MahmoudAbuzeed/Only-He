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
exports.StackHolderController = void 0;
const common_1 = require("@nestjs/common");
const stack_holder_service_1 = require("./stack-holder.service");
const create_stack_holder_dto_1 = require("./dto/create-stack-holder.dto");
const update_stack_holder_dto_1 = require("./dto/update-stack-holder.dto");
let StackHolderController = class StackHolderController {
    constructor(stackHolderService) {
        this.stackHolderService = stackHolderService;
    }
    create(createStackHolderDto) {
        return this.stackHolderService.create(createStackHolderDto);
    }
    findAll() {
        return this.stackHolderService.findAll();
    }
    findOne(id) {
        return this.stackHolderService.findOne(+id);
    }
    update(id, updateStackHolderDto) {
        return this.stackHolderService.update(+id, updateStackHolderDto);
    }
    remove(id) {
        return this.stackHolderService.remove(+id);
    }
    findAllProjects(id) {
        return this.stackHolderService.findAllProjects(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stack_holder_dto_1.CreateStackHolderDto]),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stack_holder_dto_1.UpdateStackHolderDto]),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/projects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StackHolderController.prototype, "findAllProjects", null);
StackHolderController = __decorate([
    (0, common_1.Controller)('stack-holder'),
    __metadata("design:paramtypes", [stack_holder_service_1.StackHolderService])
], StackHolderController);
exports.StackHolderController = StackHolderController;
//# sourceMappingURL=stack-holder.controller.js.map