import { IsEmail, IsEnum } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class RegisterCaptchaDto {
  @IsEmail()
  to: string;
  
  @IsEnum(EmailTemplateEnum)
  template: string;
}
