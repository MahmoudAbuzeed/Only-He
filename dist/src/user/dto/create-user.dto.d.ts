import { Department } from 'src/department/entities/department.entity';
import { Sector } from 'src/sector/entities/sector.entity';
export declare class CreateUserDto {
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string;
    sector: Sector;
    department: Department;
}
