import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { CREATED_SUCCESSFULLY, DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "../../messages/index";
import { ErrorHandler } from "shared/errorHandler.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SignInDto } from "./dto/signin.dto";
import { UserRepo } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "shared/logger/logger.service";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private readonly errorHandler: ErrorHandler,
    @Inject(Logger) private logger: Logger,
  ) {}

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto) { //TODO: TO be refactored
    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    try {
      return await this.userRepo.create(createUserDto);
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  async findByEmail(signInDto: SignInDto) {
    try {
      const user = await this.userRepo.getByEmail(signInDto.email);
      const isPasswordMatching = await bcrypt.compare(signInDto.password, user.password);
      if (!isPasswordMatching) throw this.errorHandler.didNotMatch();

      const finalReturnedUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
        id: user.id,
      };

      return { ...finalReturnedUser, token: this.jwtService.sign({ user }) };
    } catch (error) {
      throw this.errorHandler.invalidCredentials();
    }
  }

  async findAll() {
    const users = await this.userRepo.findAll();
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new CustomError(401, "User Not Found");
    delete user.password;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = await this.hashPassword(updateUserDto.password);
    updateUserDto.password = hashedPassword;
    const updatedUser = await this.userRepo.update(id, updateUserDto);
    if (updatedUser.affected == 0) throw new CustomError(401, "User Not Found");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedUser = await this.userRepo.remove(+id);
    if (deletedUser.affected == 0) throw new CustomError(401, "User Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
