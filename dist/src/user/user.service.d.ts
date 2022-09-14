import { ErrorHandler } from "shared/errorHandler.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SignInDto } from "./dto/signin.dto";
import { UserRepo } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
export declare class UserService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly errorHandler;
    constructor(userRepo: UserRepo, jwtService: JwtService, errorHandler: ErrorHandler);
    hashPassword(password: string): Promise<string>;
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    findByEmail(signInDto: SignInDto): Promise<{
        token: string;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
