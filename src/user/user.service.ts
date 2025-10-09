import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  UPDATED_SUCCESSFULLY,
} from "../../messages/index";
import { ErrorHandler } from "shared/errorHandler.service";
import { ResponseUtil } from "../common/utils/response.util";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SignInDto } from "./dto/signin.dto";
import { UserRepo } from "./repositories/user.repository";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "shared/logger/logger.service";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private readonly errorHandler: ErrorHandler,
    @Inject(Logger) private logger: Logger
  ) {}

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto) {
    // Validate that either email or phone is provided
    if (!createUserDto.email && !createUserDto.phone) {
      throw this.errorHandler.badRequest({
        message: "Either email or phone number is required",
      });
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    try {
      const user = await this.userRepo.create(createUserDto);
      return ResponseUtil.success(CREATED_SUCCESSFULLY, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      throw this.errorHandler.duplicateValue(error);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      // Validate that either email or phone is provided
      if (!signInDto.email && !signInDto.phone) {
        throw this.errorHandler.badRequest({
          message: "Either email or phone number is required",
        });
      }

      let user;
      if (signInDto.email) {
        user = await this.userRepo.getByEmail(signInDto.email);
      } else if (signInDto.phone) {
        user = await this.userRepo.getByPhone(signInDto.phone);
      }

      if (!user) {
        throw this.errorHandler.invalidCredentials();
      }

      const isPasswordMatching = await bcrypt.compare(
        signInDto.password,
        user.password
      );
      if (!isPasswordMatching) throw this.errorHandler.didNotMatch();

      const finalReturnedUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
        phone: user.phone,
        id: user.id,
      };

      const token = this.jwtService.sign(
        { user: finalReturnedUser },
        {
          secret: process.env.JWT_SECRET || "default-secret-key",
          expiresIn: process.env.JWT_EXPIRES_IN || "24h",
        }
      );

      return ResponseUtil.success("Login successful", {
        user: finalReturnedUser,
        token,
      });
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.invalidCredentials();
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.findAll();
      for (const user of users) {
        user.password = undefined;
      }
      return ResponseUtil.success("Users retrieved successfully", users);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) throw this.errorHandler.notFound();
    delete user.password;
    return ResponseUtil.success("User retrieved successfully", user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = await this.hashPassword(updateUserDto.password);
    updateUserDto.password = hashedPassword;
    const updatedUser = await this.userRepo.update(id, updateUserDto);
    if (updatedUser.affected == 0) throw this.errorHandler.notFound();
    return ResponseUtil.successNoData(UPDATED_SUCCESSFULLY);
  }

  async remove(id: number) {
    const deletedUser = await this.userRepo.remove(+id);
    if (deletedUser.affected == 0) throw this.errorHandler.notFound();
    return ResponseUtil.successNoData(DELETED_SUCCESSFULLY);
  }
}
