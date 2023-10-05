import {Controller,Post,Body} from '@nestjs/common'
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/dto/user.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto)
  }
}