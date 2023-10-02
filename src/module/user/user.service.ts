import {Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserLoginDto } from './user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}
  
  findAll() {
    return this.userRepository.find()
  }
  
  findOne(id: number) {
    return this.userRepository.findOneBy({id})
  }
  
  async create(userDto: UserDto) {
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
    if (res) {
      return {
        code: 200,
        msg: '成功',
        data: res
      }
    }
    else {
      return res;
    }
  }
  
  async update(userDto: UserDto) {
    try {
      let user = await this.userRepository.findOne({where: {id: userDto.id}})
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
  
  async login({account, password: psd}: UserLoginDto) {
    const user = await this.userRepository.findOne({where:{account}})
    if (psd !== user?.password) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, username: user.account}
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }
} 