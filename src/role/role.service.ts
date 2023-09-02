import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleRepo } from "./role.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo, private readonly errorHandler: ErrorHandler) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.roleRepo.create(createRoleDto);
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  async findAll() {
    return await this.roleRepo.findAll();
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne(id);
    if (!role) throw new CustomError(401, "Role Not Found");
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleRepo.update(id, updateRoleDto);
    if (updatedRole.affected == 0) throw new CustomError(401, "Role Not Found");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedRole = await this.roleRepo.remove(+id);
    if (deletedRole.affected == 0) throw new CustomError(401, "Role Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
