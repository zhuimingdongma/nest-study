import { ApiProperty } from '@nestjs/swagger';
import { IsCreditCard, IsIBAN, IsString, MaxLength } from 'class-validator';

export class PaymentAddDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: '银行卡号长度不得超过20位' })
  bank_number: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  bank_of: string;

  @ApiProperty()
  @IsString()
  bank_name: string;
}
