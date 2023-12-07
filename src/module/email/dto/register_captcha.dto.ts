import { IsEmail } from 'class-validator';

export class RegisterCaptchaDto {
  @IsEmail()
  to: string;
}
