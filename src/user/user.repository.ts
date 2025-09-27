import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getByPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    return user;
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }

  async findOneWithRoles(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  async findAllWithRoles() {
    return await this.userRepository.find({
      relations: ['roles'],
      order: { created_at: 'DESC' },
    });
  }

  async assignRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    
    if (!user) {
      return null;
    }

    // Clear existing roles and assign new ones
    user.roles = roleIds.map(id => ({ id } as any));
    return await this.userRepository.save(user);
  }

  // Additional methods for AdminUserService
  createQueryBuilder(alias: string) {
    return this.userRepository.createQueryBuilder(alias);
  }
}
