import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common'
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/user.dto';
import { AddAuthDto } from './dto/addAuth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class AuthService {
  constructor(
     private userService: UserService, 
     private jwtService: JwtService,
     @InjectRepository(User) private userRepository: Repository<User>,
     @InjectRepository(Role) private roleRepository: Repository<Role>,
     ) {}
  
  async login({account, password: psd}:UserLoginDto) {
    const user = await this.userService.findOne(account)
    if (psd !== user?.password) {
      throw new HttpException("用户密码错误", HttpStatus.BAD_REQUEST)
    }
    const payload = { sub: user.id, username: user.account}
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }
  
  /**
   * 先把某个用户 关联为一个角色 如dev
   * 再将角色与权限关联
   */
  async add(authAddDto: AddAuthDto) {
    try {
      const {id, roleId, permissionId} = authAddDto || {}
      await this.userRepository.createQueryBuilder("user").relation(User, "roles").of(id).add(roleId)
      // await this.roleRepository.createQueryBuilder('role').relation(Role, "permission").of()
    }
    catch (err) {
      
    }
  }
}