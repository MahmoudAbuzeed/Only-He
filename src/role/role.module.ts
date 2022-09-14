import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { Role } from "./entities/role.entity";
import { RoleRepo } from "./role.repository";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepo, ErrorHandler],
})
export class RoleModule {}
