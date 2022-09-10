import { CreateStackHolderDto } from './dto/create-stack-holder.dto';
import { UpdateStackHolderDto } from './dto/update-stack-holder.dto';
import { StackHolderRepo } from './stack-holder.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
export declare class StackHolderService {
    private readonly stackHolderRepo;
    private readonly errorHandler;
    constructor(stackHolderRepo: StackHolderRepo, errorHandler: ErrorHandler);
    create(createStackHolderDto: CreateStackHolderDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/stack-holder.entity").StackHolder[]>;
    findOne(id: number): Promise<import("./entities/stack-holder.entity").StackHolder>;
    update(id: number, updateStackHolderDto: UpdateStackHolderDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findAllProjects(stackHolderId: number): Promise<any>;
}
