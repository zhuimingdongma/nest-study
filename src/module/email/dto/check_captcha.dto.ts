import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class CheckCaptcha {
  @ApiProperty({ type: 'email' })
  @IsEmail()
  to: string;

  @ApiProperty()
  @IsString()
  captcha: string;

  @ApiProperty({enum: EmailTemplateEnum})
  @IsEnum(EmailTemplateEnum)
  template: EmailTemplateEnum;
}
