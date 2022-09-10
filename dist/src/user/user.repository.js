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
        var _a, _b, _c;
        const user = await this.userRepository.findOne({ email });
        const department = await this.userRepository.find({
            where: { email: user === null || user === void 0 ? void 0 : user.email },
            relations: ['department'],
        });
        return Object.assign(Object.assign({}, user), { department: {
                id: (_a = department[0]) === null || _a === void 0 ? void 0 : _a.department.id,
                name: (_b = department[0]) === null || _b === void 0 ? void 0 : _b.department.name,
                type: (_c = department[0]) === null || _c === void 0 ? void 0 : _c.department.type,
            } });
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
};
UserRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepo);
exports.UserRepo = UserRepo;
//# sourceMappingURL=user.repository.js.map