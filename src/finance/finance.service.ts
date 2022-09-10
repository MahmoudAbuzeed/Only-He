import { Injectable } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

import { FinanceRepo } from './finance.repository';
import {
  CREATED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
} from 'messages';
import { ErrorHandler } from 'shared/errorHandler.service';

@Injectable()
export class FinanceService {
  constructor(
    private readonly financeRepo: FinanceRepo,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    createFinanceDto.account_number = null;
    createFinanceDto.bank_name = null;
    createFinanceDto.general_information = null;

    createFinanceDto.first_withdrawal_date = new Date(
      createFinanceDto.first_withdrawal_date,
    );
    createFinanceDto.final_withdrawal_date = new Date(
      createFinanceDto.final_withdrawal_date,
    );
    createFinanceDto.account_activation_date = new Date(
      createFinanceDto.account_activation_date,
    );
    try {
      await this.financeRepo.create(createFinanceDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.financeRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const finance = await this.financeRepo.findOne(id);
    if (!finance) throw this.errorHandler.notFound();
    return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto) {
    updateFinanceDto.first_withdrawal_date = new Date(
      updateFinanceDto.first_withdrawal_date,
    );
    updateFinanceDto.final_withdrawal_date = new Date(
      updateFinanceDto.final_withdrawal_date,
    );
    updateFinanceDto.account_activation_date = new Date(
      updateFinanceDto.account_activation_date,
    );
    const updatedFinance = await this.financeRepo.update(id, updateFinanceDto);
    if (updatedFinance.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedFinance = await this.financeRepo.remove(+id);
    if (deletedFinance.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
