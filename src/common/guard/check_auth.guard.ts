import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/module/role/role.entity';
import { User } from 'src/module/user/user.entity';
import { Repository } from 'typeorm';
import { Permission } from '../tools/permission';

export class checkAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private reflector: Reflector,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride('roles', [
      ctx.getClass(),
      ctx.getHandler(),
    ]);
    const {
      user: { sub },
    } = ctx.switchToHttp().getRequest() || {};

    const permission = await new Permission(
      this.userRepository,
      this.roleRepository,
    ).extractUserPermission(sub);
    if (permission instanceof HttpException) return false;
    // 装饰器中是否包含 提取出来的权限
    else if (permission) {
      for (let index = 0; index < permission.length; index++) {
        const element = permission[index];
        console.log('element: ', element);
        if (role.includes(element.name)) {
          return true;
        }
      }
    } else return false;
    return true;
  }
}
