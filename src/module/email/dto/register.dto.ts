import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class RegisterDto {
  @IsEmail()
  to: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(EmailTemplateEnum)
  template: EmailTemplateEnum;
}
