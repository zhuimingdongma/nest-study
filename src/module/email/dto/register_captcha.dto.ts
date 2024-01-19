import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class RegisterCaptchaDto {
  @ApiProperty({ type: 'email' })
  @IsEmail()
  to: string;

  @ApiProperty({ enum: EmailTemplateEnum })
  @IsEnum(EmailTemplateEnum)
  template: string;
}
