import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom, lastValueFrom, take, timeout } from 'rxjs';
import { Public } from 'src/common/decorator/public.decorator';
import { RegisterCaptchaDto } from './dto/register_captcha.dto';
import { Response } from 'express';
import { join } from 'path';
import { CheckCaptcha } from './dto/check_captcha.dto';
import { Tools } from 'src/common/tools/tools';
import { RegisterDto } from './dto/register.dto';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';
import { UserService } from '../user/user.service';

@Controller('/email')
export class EmailController {
  constructor(
    @Inject('CALC_SERVICE') private clientService: ClientProxy,
    private userService: UserService, // @Inject() private UserService: UserService, //
  ) {}
  @Get('/test')
  @Public()
  test(): Observable<number> {
    return this.clientService.send('test', [1, 2, 3, 10]).pipe(timeout(5000));
  }

  @Post('/getCode')
  @Public()
  async captcha(@Body() registerCaptchaDto: RegisterCaptchaDto) {
    try {
      const { to, template } = registerCaptchaDto;
      const result = await lastValueFrom(
        this.clientService
          .send('email', {
            to,
            subject: 'welcome to nest',
            template,
          })
          .pipe(timeout(5000)),
      );
      return result;
    } catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/check')
  @Public()
  async check(@Body() checkCaptcha: CheckCaptcha) {
    try {
      const result = await lastValueFrom(
        this.clientService.send('check', checkCaptcha).pipe(timeout(5000)),
      );
      if (new Tools().isNull(result))
        return new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
      return result;
    } catch (err) {
      const logger = new Logger();
      logger.error('测试');
      return new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await firstValueFrom(
        this.clientService.send('register', registerDto).pipe(timeout(5000)),
      );
      const { template, to, password } = registerDto;
      if (!new Tools().isNull(result)) {
        if (
          template === EmailTemplateEnum.RESET ||
          template === EmailTemplateEnum.RETRIEVE
        ) {
          await this.userService.update({ account: to, password });
        } else if (template === EmailTemplateEnum.REGISTER) {
          return await this.userService.register(registerDto);
        }
      }
    } catch (err) {
      console.log('err: ', err);
      return new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
