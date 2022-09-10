"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const common_1 = require("@nestjs/common");
let ErrorHandler = class ErrorHandler {
    notFound(error = { message: 'Not Found' }) {
        throw new common_1.NotFoundException(error);
    }
    badRequest(error) {
        throw new common_1.BadRequestException(error);
    }
    duplicateValue(error) {
        throw new common_1.BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Some fields are invalid',
        });
    }
    didNotMatch() {
        throw new common_1.BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Password did not match',
        });
    }
    invalidCredentials() {
        throw new common_1.HttpException('Wrong credentials provided', common_1.HttpStatus.BAD_REQUEST);
    }
};
ErrorHandler = __decorate([
    (0, common_1.Injectable)()
], ErrorHandler);
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.service.js.map