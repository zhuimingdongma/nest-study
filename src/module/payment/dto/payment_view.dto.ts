import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PaymentViewDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
