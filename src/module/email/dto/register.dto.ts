import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { EmailTemplateEnum } from 'src/common/enum/public.enum';

export class RegisterDto {
  @ApiProperty({ type: 'email' })
  @IsEmail()
  to: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: EmailTemplateEnum })
  @IsEnum(EmailTemplateEnum)
  template: EmailTemplateEnum;
}
