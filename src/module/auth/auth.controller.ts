import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/dto/user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { AddAuthDto } from './dto/addAuth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Post('/add')
  @Auth(AuthEnum.SUPER)
  async Add(@Body() authAddDto: AddAuthDto) {
    return await this.authService.add(authAddDto);
  }
}
