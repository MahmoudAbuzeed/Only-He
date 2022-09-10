import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Finance } from './entities/finance.entity';

@Injectable()
export class FinanceRepo {
  constructor(
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    return await this.financeRepository.save(createFinanceDto);
  }

  async findAll() {
    return await this.financeRepository.find();
  }

  async findOne(id: number) {
    return await this.financeRepository.findOne(id);
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto) {
    return await this.financeRepository.update(id, updateFinanceDto);
  }

  async remove(id: number) {
    return await this.financeRepository.delete({ id });
  }
}
