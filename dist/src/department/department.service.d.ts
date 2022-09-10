import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepo } from './department.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class DepartmentService {
    private readonly departmentRepo;
    private readonly errorHandler;
    constructor(departmentRepo: DepartmentRepo, errorHandler: ErrorHandler);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/department.entity").Department[]>;
    findOne(id: number): Promise<import("./entities/department.entity").Department>;
    update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
