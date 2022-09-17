import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
export declare class UserRepo {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    findAll(): Promise<User[]>;
    getByEmail(email: string): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        password: string;
        mobile_number: string;
        profile_picture: string;
        created_at: Date;
        updated_at: Date;
    }>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
