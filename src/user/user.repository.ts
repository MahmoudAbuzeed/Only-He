import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }

  async invalidateRefreshToken(userId: number) {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new CustomError(401, "User Not Found");
    user.token = null;
    await this.userRepository.save(user);
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new CustomError(401, "User Not Found");
    user.token = refreshToken;
    await this.userRepository.save(user);
  }
}
