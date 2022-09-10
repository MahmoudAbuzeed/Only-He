import { User } from 'src/user/entities/user.entity';
export declare class Role {
    id: number;
    name: string;
    details: string;
    created_at: Date;
    updated_at: Date;
    users: User[];
}
