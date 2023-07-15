import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleRepo } from "./role.repository";
import { ErrorHandler } from "shared/errorHandler.service";
export declare class RoleService {
    private readonly roleRepo;
    private readonly errorHandler;
    constructor(roleRepo: RoleRepo, errorHandler: ErrorHandler);
    create(createRoleDto: CreateRoleDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findOne(id: number): Promise<import("./entities/role.entity").Role>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
