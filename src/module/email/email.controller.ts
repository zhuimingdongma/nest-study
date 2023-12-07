import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import { Public } from 'src/common/decorator/public.decorator';
import { RegisterCaptchaDto } from './dto/register_captcha.dto';
import { Response } from 'express';
import { join } from 'path';

@Controller('/email')
export class EmailController {
  constructor(
    @Inject('CALC_SERVICE') private calcService: ClientProxy, // private appService: AppService,
  ) {}
  @Get('/test')
  @Public()
  test(): Observable<number> {
    return this.calcService.send('test', [1, 2, 3, 10]).pipe(timeout(5000));
  }

  @Post('/register')
  @Public()
  captcha(@Body() registerCaptchaDto: RegisterCaptchaDto) {
    const { to } = registerCaptchaDto;
    return this.calcService
      .send('email', { to, subject: 'welcome to nest', template: 'register' })
      .pipe(timeout(5000));
  }

  @Post('/check')
  @Public()
  check() {}
}
