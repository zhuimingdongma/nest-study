import {Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common'
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

@Injectable()
export class UserService {
  constructor(
   @InjectRepository(User) private userRepository: Repository<User>,
   @InjectRepository(Role) private roleRepository: Repository<Role>,
   @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
   private jwtService: JwtService) {}
  
  findAll() {
    return this.userRepository.find()
  }
  
  findOne(account: string) {
    return this.userRepository.findOneBy({account})
  }
  
  async register(userDto: UserDto) {
    const user = new User();
    for (const key in userDto) {
      if (Object.prototype.hasOwnProperty.call(userDto, key)) {
        const element = userDto[key];
        user[key] = element;
      }
    }
    const res = await this.userRepository.save(user).catch(err => {
      console.error(err)
      return err;
    })
    const isAdmin = res.account === '雪之下雪乃' ? true : false
    let role = await this.roleRepository.find({where: {name: isAdmin ? 'dev' : 'user'}})
    let permission = await this.permissionRepository.findOne({where: {name: isAdmin ? 'admin' : 'common'}})
    // 正常登录为普通用户 冬马和纱为管理员 res.id为刚创建的用户id role[0].id为对应角色id
    role[0] && this.userRepository.createQueryBuilder().relation(User, "roles").of(res.id).add(role[0].id)
    permission && this.roleRepository.createQueryBuilder().relation(Role, "permission").of(role[0].id).add(permission?.id)
    
    if (res) {
      return {
        code: 200,
        msg: '注册成功',
        data: res
      }
    }
    else {
      return res;
    }
  }
  
  async update(userDto: UpdateUserDto) {
    try {
      let user = await this.userRepository.findOne({where: {account: userDto.account}})
      if (user) {
        for (const key in userDto) {
          if (Object.prototype.hasOwnProperty.call(userDto, key)) {
            const element = userDto[key];
            user![key] = element;
          }
        }
        let res = await this.userRepository.save(user)
        return {
          msg: res,
          code: 200
        }
      }
      else {
        return {
          msg: '没有该用户'
        }
      }
    }
    catch (err) {
      return {
        msg: err
      }
    }


  }

  async getUserInfo(token?: string, userId?: UUIDVersion) {
    const tools = new Tools()
    let sub 
    if (!tools.isNull(token)) {
      const parseVal = await tools.parseToken(token!, this.jwtService)
      sub = parseVal.sub
    }
    else if (!tools.isNull(userId)){
      sub = userId
    }
    const res  = await this.userRepository.find({where:{id: sub ?? ''}})
    if (tools.isNull(res)) return new NotFoundException('没有该用户')
    const {id, ...remain} = res[0] || {}
    const permission = new GetPermission(this.userRepository, this.roleRepository)
    const permissionVal = await permission.extractUserPermission(id) as any
    const permissionMenu = new PermissionMenu(this.permissionRepository)
    const {menu} = await permissionMenu.getMenu(permissionVal.id) || {}
    return {id, ...remain, ...{menuList:menu}};
  }
} 