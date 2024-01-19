import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PaymentDelDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
