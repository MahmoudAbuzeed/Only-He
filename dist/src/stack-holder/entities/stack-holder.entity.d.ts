import { Project } from 'src/project/entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Task } from 'src/task/entities/task.entity';
export declare class StackHolder {
    id: number;
    title: string;
    name: string;
    phone_number: string;
    created_at: Date;
    updated_at: Date;
    projects: Project[];
    components: Component[];
    tasks: Task[];
}
