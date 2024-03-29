import {
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserLoginDto } from './dto/user.dto';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Tools } from 'src/common/tools/tools';
import { JwtService } from '@nestjs/jwt';
import { Permission as GetPermission } from 'src/common/tools/permission';
import { PermissionMenu } from 'src/common/tools/menu';
import { UUIDVersion } from 'class-validator';
import { UserDeleteDto } from './dto/userDel.dto';
import { CorrespondingRoleDto } from './dto/correspondingRole.dto';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from '../email/dto/register.dto';
import { LogService } from '../log/log.service';
import { IPRequest } from 'src/common/types/global';

@Injectable()
export class UserService {
  private tools = new Tools();
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private jwtService: JwtService,
    private redisService: RedisService,
    private logService: LogService,
  ) {}

  public async delete(userDeleteDto: UserDeleteDto) {
    try {
      const { id, userList } = userDeleteDto || {};
      const isNull = new Tools().isNull;
      if (!isNull(userList)) {
        for (let index = 0; index < userList.length; index++) {
          const element = userList[index];
          await this.userRepository.delete({ id: element as UUIDVersion });
        }
      } else await this.userRepository.delete({ id: id as UUIDVersion });
      return '删除成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  findAll(request: IPRequest) {
    this.logService.info(`ip为${request.clientIp} 测试日值`);
    return this.userRepository.find();
  }

  async findOne(account: string) {
    return await this.userRepository.findOne({ where: { account } });
  }

  public async register(userDto: RegisterDto) {
    try {
      const { password, to } = userDto || {};
      const tools = new Tools();
      const user = await this.userRepository.create({
        password: String(tools.encrypt(password)),
        account: to,
      });
      const res = await this.userRepository.save(user);
      let role = await this.roleRepository.findOne({
        where: { name: 'user' },
      });
      // 正常登录为普通用户 res.id为刚创建的用户id role[0].id为对应角色id
      role &&
        this.userRepository
          .createQueryBuilder()
          .relation(User, 'roles')
          .of(res.id)
          .add(role.id);

      this.logService.warn(`${to} 注册成功`);
      return '注册成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async update(userDto: UpdateUserDto) {
    try {
      let user = await this.userRepository.findOne({
        where: { account: userDto.account },
      });
      if (user) {
        for (const key in userDto) {
          if (Object.prototype.hasOwnProperty.call(userDto, key)) {
            const element = userDto[key];
            user![key] = element;
          }
        }
        let res = await this.userRepository.save(user);
        return {
          msg: res,
          code: 200,
        };
      } else {
        return {
          msg: '没有该用户',
        };
      }
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  /**
   * 可传token获取用户信息 也可直接传入userId获取
   * @param token
   * @param userId 用户id
   * @returns
   */
  async getUserInfo(token?: string, userId?: UUIDVersion) {
    try {
      const tools = new Tools();
      let sub;
      if (!tools.isNull(token)) {
        const parseVal = await tools.parseToken(token!, this.jwtService);
        sub = parseVal.sub;
      } else if (!tools.isNull(userId)) {
        sub = userId;
      }
      const res = await this.userRepository.find({ where: { id: sub ?? '' } });
      if (tools.isNull(res)) throw new NotFoundException('没有该用户');
      const { id, ...remain } = res[0] || {};
      const permission = new GetPermission(
        this.userRepository,
        this.roleRepository,
      );
      const permissionVal = (await permission.extractUserPermission(id)) as any;
      const permissionMenu = new PermissionMenu(this.permissionRepository);
      const { menu } = (await permissionMenu.getMenu(permissionVal.id)) || {};
      return { id, ...remain, ...{ menuList: menu } };
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  /**
   * 获取角色对应用户
   */
  async getRoleCorrespondingUser(correspondingRoleDto: CorrespondingRoleDto) {
    try {
      const { roleId } = correspondingRoleDto || {};
      const role_users = await this.redisService.gatherSmembers(
        `${roleId}`,
        10,
      );
      // for (let index = 0; index < role_users.length; index++) {
      //   const element = role_users[index];
      //   userList.push(JSON.parse(element));
      // }
      if (!new Tools().isNull(role_users)) return role_users;
      const users = await this.userRepository.query(
        `select user.id,user.account,user.nickname,user.email,user.avatar,user.phone,user.status from user INNER JOIN user_roles ON user.id = user_roles.userId WHERE user_roles.roleId = '${roleId}'`,
      );

      await this.redisService.gatherSADD(`${roleId}`, JSON.stringify(users));
      return users;
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
