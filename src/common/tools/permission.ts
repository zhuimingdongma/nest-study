import { InjectRepository } from '@nestjs/typeorm';
import { UUIDVersion } from 'class-validator';
import { Role } from 'src/module/role/role.entity';
import { User } from 'src/module/user/user.entity';
import { Repository } from 'typeorm';
import { Tools } from './tools';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

export class Permission {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  /**
   *
   * @param id 用户id
   * @returns 用户权限
   */
  async extractUserPermission(id: UUIDVersion) {
    try {
      // 得到该用户对应的角色
      const { roles } =
        (await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.roles', 'role')
          .where('user.id = :id', { id })
          .getOne()) || {};
      if (roles) {
        const id = roles[0].id;
        let permissions = await this.roleRepository.find({
          relations: { permission: true },
        });
        if (!new Tools().isNull(permissions)) {
          // 得到权限
          const permission = permissions.find((item) => item.id === id)
            ?.permission;
          if (!new Tools().isNull(permission)) {
            return permission;
          } else {
            return new NotFoundException('暂无权限');
          }
        }
      }
      return new NotFoundException('暂无该用户');
    } catch (err) {
      return new ForbiddenException(err);
    }
  }
}
