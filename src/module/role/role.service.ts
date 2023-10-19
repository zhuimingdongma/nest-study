import { Injectable } from "@nestjs/common/decorators/core";
import { Repository } from "typeorm";
import { Role } from "./role.entity";
import { RoleDto, RoleUpdateDto } from './dto/role.dto';
import { Tools } from "src/common/tools/tools";
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "../permission/permission.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>
  ) {}
  
  async create(roleDto: RoleDto) {
    try {
      const {name, permissionId} = roleDto
      const isExist= await this.roleRepository.findOne({where: {name}})
      const isPermissionExist = await this.permissionRepository.findOne({where: {id: permissionId}})
      if (!new Tools().isNull(isExist) || new Tools().isNull(isPermissionExist)) return new HttpException("该角色已存在或没有该权限", HttpStatus.BAD_REQUEST)
      const role = await this.roleRepository.create()
      role.name = name;
      await this.roleRepository.save(role);
      
      const foundRole = await this.roleRepository.findOne({where: {name}})
      await this.roleRepository.createQueryBuilder("role").relation(Role, "permission").of(foundRole!.id).add(permissionId)
      return "创建角色成功"
    }
    catch (err) {
      return err;
    }
  }
  
  async update(roleUpdateDto: RoleUpdateDto) {
    try {
      const {id, name} = roleUpdateDto
      const role = await this.roleRepository.findOne({where: {id}})
      if (new Tools().isNull(role)) return new NotFoundException('未找到该角色')
      const {affected} = await this.roleRepository.update(id, {name})
      if (affected === 0) return new HttpException("更新失败", HttpStatus.FAILED_DEPENDENCY)
      else return "更新成功"
    }
    catch (err) {
      return err;
    }
  }
}
