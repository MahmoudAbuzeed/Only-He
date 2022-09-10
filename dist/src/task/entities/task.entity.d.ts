import { Component } from 'src/component/entities/component.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';
export declare class Task {
    id: number;
    name: string;
    budget: number;
    description: string;
    approval_requirements: string;
    priority: string;
    man_power: number;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    component: Component;
    sectors: Sector[];
    stackHolders: StackHolder[];
}
