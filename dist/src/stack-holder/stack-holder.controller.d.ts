import { StackHolderService } from './stack-holder.service';
import { CreateStackHolderDto } from './dto/create-stack-holder.dto';
import { UpdateStackHolderDto } from './dto/update-stack-holder.dto';
export declare class StackHolderController {
    private readonly stackHolderService;
    constructor(stackHolderService: StackHolderService);
    create(createStackHolderDto: CreateStackHolderDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/stack-holder.entity").StackHolder[]>;
    findOne(id: string): Promise<import("./entities/stack-holder.entity").StackHolder>;
    update(id: string, updateStackHolderDto: UpdateStackHolderDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findAllProjects(id: string): Promise<any>;
}
