import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common'
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  
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
}