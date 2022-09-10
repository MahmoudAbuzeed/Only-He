import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UserRepo {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    findAll(): Promise<User[]>;
    getByEmail(email: string): Promise<{
        department: {
            id: any;
            name: any;
            type: any;
        };
        id: number;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        password: string;
        created_at: Date;
        updated_at: Date;
        sector: import("../sector/entities/sector.entity").Sector;
    }>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
