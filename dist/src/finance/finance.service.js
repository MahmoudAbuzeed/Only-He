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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const finance_repository_1 = require("./finance.repository");
const messages_1 = require("../../messages");
const errorHandler_service_1 = require("../../shared/errorHandler.service");
let FinanceService = class FinanceService {
    constructor(financeRepo, errorHandler) {
        this.financeRepo = financeRepo;
        this.errorHandler = errorHandler;
    }
    async create(createFinanceDto) {
        createFinanceDto.account_number = null;
        createFinanceDto.bank_name = null;
        createFinanceDto.general_information = null;
        createFinanceDto.first_withdrawal_date = new Date(createFinanceDto.first_withdrawal_date);
        createFinanceDto.final_withdrawal_date = new Date(createFinanceDto.final_withdrawal_date);
        createFinanceDto.account_activation_date = new Date(createFinanceDto.account_activation_date);
        try {
            await this.financeRepo.create(createFinanceDto);
            return { message: messages_1.CREATED_SUCCESSFULLY };
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findAll() {
        try {
            return await this.financeRepo.findAll();
        }
        catch (error) {
            throw this.errorHandler.badRequest(error);
        }
    }
    async findOne(id) {
        const finance = await this.financeRepo.findOne(id);
        if (!finance)
            throw this.errorHandler.notFound();
        return finance;
    }
    async update(id, updateFinanceDto) {
        updateFinanceDto.first_withdrawal_date = new Date(updateFinanceDto.first_withdrawal_date);
        updateFinanceDto.final_withdrawal_date = new Date(updateFinanceDto.final_withdrawal_date);
        updateFinanceDto.account_activation_date = new Date(updateFinanceDto.account_activation_date);
        const updatedFinance = await this.financeRepo.update(id, updateFinanceDto);
        if (updatedFinance.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.UPDATED_SUCCESSFULLY };
    }
    async remove(id) {
        const deletedFinance = await this.financeRepo.remove(+id);
        if (deletedFinance.affected == 0)
            throw this.errorHandler.notFound();
        return { message: messages_1.DELETED_SUCCESSFULLY };
    }
};
FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [finance_repository_1.FinanceRepo,
        errorHandler_service_1.ErrorHandler])
], FinanceService);
exports.FinanceService = FinanceService;
//# sourceMappingURL=finance.service.js.map