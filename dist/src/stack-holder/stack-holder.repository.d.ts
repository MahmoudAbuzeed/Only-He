import { Repository } from 'typeorm';
import { StackHolder } from './entities/stack-holder.entity';
export declare class StackHolderRepo {
    private stackHolderRepo;
    constructor(stackHolderRepo: Repository<StackHolder>);
    create(createStackHolderDto: Partial<StackHolder>): Promise<Partial<StackHolder> & StackHolder>;
    findAll(): Promise<StackHolder[]>;
    findOne(id: number): Promise<StackHolder>;
    update(id: number, updateStackHolderDto: Partial<StackHolder>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    findAllProjects(stackHolderId: number): Promise<StackHolder[]>;
}
