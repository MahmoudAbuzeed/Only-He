import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SignInDto } from "./dto/signin.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        first_name: string;
        last_name: string;
        user_name: string;
        email: string;
        id: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
