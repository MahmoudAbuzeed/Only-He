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
exports.UserRepo = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const custom_error_1 = require("../../shared/custom-error/custom-error");
let UserRepo = class UserRepo {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        return await this.userRepository.save(createUserDto);
    }
    async findAll() {
        return await this.userRepository.find();
    }
    async getByEmail(email) {
        return await this.userRepository.findOne({ email });
    }
    async findOne(id) {
        return await this.userRepository.findOne(id);
    }
    async update(id, updateUserDto) {
        return await this.userRepository.update(id, updateUserDto);
    }
    async remove(id) {
        return await this.userRepository.delete({ id });
    }
    async invalidateRefreshToken(userId) {
        const user = await this.userRepository.findOne(userId);
        if (!user)
            throw new custom_error_1.CustomError(401, "User Not Found");
        user.token = null;
        await this.userRepository.save(user);
    }
    async saveRefreshToken(userId, refreshToken) {
        const user = await this.userRepository.findOne(userId);
        if (!user)
            throw new custom_error_1.CustomError(401, "User Not Found");
        user.token = refreshToken;
        await this.userRepository.save(user);
    }
};
UserRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepo);
exports.UserRepo = UserRepo;
//# sourceMappingURL=user.repository.js.map