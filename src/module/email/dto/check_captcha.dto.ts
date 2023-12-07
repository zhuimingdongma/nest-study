import { IsEmail, IsString } from 'class-validator';

export class CheckCaptcha {
  @IsEmail()
  to: string;

  @IsString()
  captcha: string;
}
