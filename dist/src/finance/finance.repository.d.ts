import { Repository } from 'typeorm';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Finance } from './entities/finance.entity';
export declare class FinanceRepo {
    private financeRepository;
    constructor(financeRepository: Repository<Finance>);
    create(createFinanceDto: CreateFinanceDto): Promise<CreateFinanceDto & Finance>;
    findAll(): Promise<Finance[]>;
    findOne(id: number): Promise<Finance>;
    update(id: number, updateFinanceDto: UpdateFinanceDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
