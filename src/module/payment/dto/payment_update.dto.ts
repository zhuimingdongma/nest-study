import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class PaymentUpdateDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  bank_name: string;

  @IsOptional()
  @MaxLength(20)
  @IsString()
  bank_of: string;

  @IsOptional()
  @MaxLength(20, { message: '银行卡号长度不得超过20位' })
  @IsString()
  bank_number: string;
}
