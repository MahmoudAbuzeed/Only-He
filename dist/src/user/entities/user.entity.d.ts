import { Sector } from 'src/sector/entities/sector.entity';
import { Department } from 'src/department/entities/department.entity';
export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    sector: Sector;
    department: Department;
}
