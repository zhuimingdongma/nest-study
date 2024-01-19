import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentCheckDto {
  @ApiProperty()
  @IsString()
  bank_number: string;
}
