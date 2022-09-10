"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackHolderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stack_holder_service_1 = require("./stack-holder.service");
const stack_holder_controller_1 = require("./stack-holder.controller");
const stack_holder_repository_1 = require("./stack-holder.repository");
const stack_holder_entity_1 = require("./entities/stack-holder.entity");
let StackHolderModule = class StackHolderModule {
};
StackHolderModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([stack_holder_entity_1.StackHolder])],
        controllers: [stack_holder_controller_1.StackHolderController],
        providers: [stack_holder_service_1.StackHolderService, stack_holder_repository_1.StackHolderRepo],
    })
], StackHolderModule);
exports.StackHolderModule = StackHolderModule;
//# sourceMappingURL=stack-holder.module.js.map