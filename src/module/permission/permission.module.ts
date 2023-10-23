import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./permission.entity";
import { PermissionController } from "./permission.controller";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Role])],
  controllers: [PermissionController],
  providers:[PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}