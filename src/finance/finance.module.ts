import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Finance } from './entities/finance.entity';
import { FinanceRepo } from './finance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Finance])],

  controllers: [FinanceController],
  providers: [FinanceService, FinanceRepo],
})
export class FinanceModule {}
