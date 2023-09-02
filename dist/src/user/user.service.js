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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const index_1 = require("../../messages/index");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
const user_repository_1 = require("./user.repository");
const jwt_1 = require("@nestjs/jwt");
const logger_service_1 = require("../../shared/logger/logger.service");
const custom_error_1 = require("../../shared/custom-error/custom-error");
let UserService = class UserService {
    constructor(userRepo, jwtService, errorHandler, logger) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.errorHandler = errorHandler;
        this.logger = logger;
    }
    async hashPassword(password) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword;
    }
    async create(createUserDto) {
        const hashedPassword = await this.hashPassword(createUserDto.password);
        createUserDto.password = hashedPassword;
        try {
            return await this.userRepo.create(createUserDto);
        }
        catch (error) {
            throw new custom_error_1.CustomError(400, error.message);
        }
    }
    async findByEmail(signInDto) {
        try {
            const user = await this.userRepo.getByEmail(signInDto.email);
            const isPasswordMatching = await bcrypt.compare(signInDto.password, user.password);
            if (!isPasswordMatching)
                throw this.errorHandler.didNotMatch();
            const finalReturnedUser = {
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                email: user.email,
                id: user.id,
            };
            return Object.assign(Object.assign({}, finalReturnedUser), { token: this.jwtService.sign({ user }) });
        }
        catch (error) {
            throw this.errorHandler.invalidCredentials();
        }
    }
    async findAll() {
        const users = await this.userRepo.findAll();
        for (const user of users) {
            delete user.password;
        }
        return users;
    }
    async findOne(id) {
        const user = await this.userRepo.findOne(id);
        if (!user)
            throw new custom_error_1.CustomError(401, "User Not Found");
        delete user.password;
        return user;
    }
    async update(id, updateUserDto) {
        const hashedPassword = await this.hashPassword(updateUserDto.password);
        updateUserDto.password = hashedPassword;
        const updatedUser = await this.userRepo.update(id, updateUserDto);
        if (updatedUser.affected == 0)
            throw new custom_error_1.CustomError(401, "User Not Found");
        return { message: index_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedUser = await this.userRepo.remove(+id);
        if (deletedUser.affected == 0)
            throw new custom_error_1.CustomError(401, "User Not Found");
        return { message: index_1.DELETED_SUCCESSFULLY };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(logger_service_1.Logger)),
    __metadata("design:paramtypes", [user_repository_1.UserRepo,
        jwt_1.JwtService,
        errorHandler_service_1.ErrorHandler,
        logger_service_1.Logger])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map