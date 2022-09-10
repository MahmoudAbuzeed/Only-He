import { Repository } from 'typeorm';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from './entities/component.entity';
import { Task } from 'src/task/entities/task.entity';
export declare class ComponentRepo {
    private component;
    private taskRepository;
    constructor(component: Repository<Component>, taskRepository: Repository<Task>);
    create(createComponentDto: CreateComponentDto): Promise<CreateComponentDto & Component>;
    findAll(): Promise<Component[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateComponentDto: UpdateComponentDto): Promise<import("typeorm").UpdateResult>;
    updateComponentSectors(updateComponentDto: UpdateComponentDto): Promise<UpdateComponentDto & Component>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
