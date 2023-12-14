import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
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
import { LogService } from '../log/log.service';

@Controller('/email')
export class EmailController {
  private tools = new Tools();
  constructor(
    @Inject('CALC_SERVICE') private clientService: ClientProxy,
    private userService: UserService,
    private logService: LogService,
  ) {}

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
      this.logService.info(`验证码已发送至 ${to}`);
      return result;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  @Post('/check')
  @Public()
  async check(@Body() checkCaptcha: CheckCaptcha) {
    try {
      const { to } = checkCaptcha;
      const result = await lastValueFrom(
        this.clientService.send('check', checkCaptcha).pipe(timeout(5000)),
      );
      if (new Tools().isNull(result))
        throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
      this.logService.info(`${to} 验证码检验通过`);
      return result;
    } catch (err) {
      this.tools.throwError(err);
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
          const res = await this.userService.update({ account: to, password });
          this.logService.info(`${to} 重置密码成功`);
          return res;
        } else if (template === EmailTemplateEnum.REGISTER) {
          const res = await this.userService.register(registerDto);
          this.logService.info(`${to} 注册成功`);
          return res;
        }
      }
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
