import { Injectable } from '@nestjs/common/decorators/core';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleDto, RoleUpdateDto } from './dto/role.dto';
import { Tools } from 'src/common/tools/tools';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class RoleService {
  private tools = new Tools()
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(roleDto: RoleDto) {
    try {
      const { name, permissionId } = roleDto;
      // const isExist= await this.roleRepository.findOne({where: {name}})
      const isPermissionExist = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });
      if (new Tools().isNull(isPermissionExist))
        throw new HttpException('没有该权限', HttpStatus.NOT_FOUND);
      const role = await this.roleRepository.create();
      role.name = name;
      await this.roleRepository.save(role);

      const foundRole = await this.roleRepository.findOne({ where: { name } });
      await this.roleRepository
        .createQueryBuilder('role')
        .relation(Role, 'permission')
        .of(foundRole!.id)
        .add(permissionId);
      return '创建角色成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async update(roleUpdateDto: RoleUpdateDto) {
    try {
      const { id, name } = roleUpdateDto;
      const role = await this.roleRepository.findOne({ where: { id } });
      if (new Tools().isNull(role)) throw new NotFoundException('未找到该角色');
      const { affected } = await this.roleRepository.update(id, { name });
      if (affected === 0)
        throw new HttpException('更新失败', HttpStatus.UNPROCESSABLE_ENTITY);
      else return '更新成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
