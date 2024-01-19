import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class PaymentUpdateDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(20)
  @IsString()
  bank_of: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(20, { message: '银行卡号长度不得超过20位' })
  @IsString()
  bank_number: string;
}
