import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/dto/user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { AddAuthDto } from './dto/addAuth.dto';
import { IPRequest } from 'src/common/types/global';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBearerAuth()
  @ApiBody({ type: [UserLoginDto] })
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto, @Req() request: IPRequest) {
    return await this.authService.login(userLoginDto, request);
  }

  @Post('/add')
  @Auth(AuthEnum.SUPER)
  @ApiBody({ type: [AddAuthDto] })
  async Add(@Body() authAddDto: AddAuthDto) {
    return await this.authService.add(authAddDto);
  }
}
