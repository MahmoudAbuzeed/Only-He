import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreateRoleDto } from "../dto/create-role.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";

import { Role } from "../entities/role.entity";

@Injectable()
export class RoleRepo {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return await this.roleRepository.findOne({ where: { name } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return await this.roleRepository.delete({ id });
  }

  async findAllWithUserCount() {
    return await this.roleRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.users", "user")
      .loadRelationCountAndMap("role.users_count", "role.users")
      .orderBy("role.created_at", "DESC")
      .getMany();
  }
}
