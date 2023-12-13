import { IsEmail, IsEnum, IsString } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class CheckCaptcha {
  @IsEmail()
  to: string;

  @IsString()
  captcha: string;
  
  @IsEnum(EmailTemplateEnum)
  template: EmailTemplateEnum;
}
