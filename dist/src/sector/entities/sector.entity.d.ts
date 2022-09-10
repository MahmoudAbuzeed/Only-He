import { Project } from 'src/project/entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Task } from 'src/task/entities/task.entity';
export declare class Sector {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    projects: Project[];
    components: Component[];
    tasks: Task[];
}
