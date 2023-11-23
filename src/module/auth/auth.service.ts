import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/user.dto';
import { AddAuthDto } from './dto/addAuth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { Tools } from 'src/common/tools/tools';

@Injectable()
export class AuthService {
  private tools: Tools;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {
    this.tools = new Tools();
  }

  async login({ account, password: psd }: UserLoginDto) {
    const user = await this.userService.findOne(account);
    if (this.tools.isNull(user)) return new NotFoundException('未找到该用户');
    if (psd !== user?.password) {
      throw new HttpException('用户密码错误', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.id, username: user.account };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * 先把某个用户 关联为一个角色 如dev
   * 再将角色与权限关联
   */
  async add(authAddDto: AddAuthDto) {
    try {
      const { id, roleId, permissionId, userIdList } = authAddDto || {};
      if (!this.tools.isNull(userIdList)) {
        for (let index = 0; index < userIdList.length; index++) {
          const element = userIdList[index];
          await this.userRepository
            .createQueryBuilder('user')
            .relation(User, 'roles')
            .of(element)
            .add(roleId);
        }
      } else
        await this.userRepository
          .createQueryBuilder('user')
          .relation(User, 'roles')
          .of(id)
          .add(roleId);
      return '添加权限成功';
    } catch (err) {}
  }
}
