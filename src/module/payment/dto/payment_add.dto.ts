import { IsCreditCard, IsIBAN, IsString, MaxLength } from 'class-validator';

export class PaymentAddDto {
  @IsString()
  @MaxLength(20, { message: '银行卡号长度不得超过20位' })
  bank_number: string;

  @IsString()
  @MaxLength(20)
  bank_of: string;

  @IsString()
  bank_name: string;
}
