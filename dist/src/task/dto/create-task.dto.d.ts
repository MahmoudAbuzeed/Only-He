import { Component } from 'src/component/entities/component.entity';
import { Sector } from 'src/sector/entities/sector.entity';
export declare class CreateTaskDto {
    name: string;
    budget: number;
    description: string;
    approval_requirements: string;
    priority: string;
    man_power: number;
    start_date: Date;
    end_date: Date;
    weight: number;
    component: Component;
    sectors: Sector[];
}
