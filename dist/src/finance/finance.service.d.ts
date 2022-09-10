import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FinanceRepo } from './finance.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class FinanceService {
    private readonly financeRepo;
    private readonly errorHandler;
    constructor(financeRepo: FinanceRepo, errorHandler: ErrorHandler);
    create(createFinanceDto: CreateFinanceDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/finance.entity").Finance[]>;
    findOne(id: number): Promise<import("./entities/finance.entity").Finance>;
    update(id: number, updateFinanceDto: UpdateFinanceDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
