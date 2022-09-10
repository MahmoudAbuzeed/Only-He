import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    create(createFinanceDto: CreateFinanceDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/finance.entity").Finance[]>;
    findOne(id: string): Promise<import("./entities/finance.entity").Finance>;
    update(id: string, updateFinanceDto: UpdateFinanceDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
