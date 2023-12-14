import { IsInt } from 'class-validator';

export class PaymentDelDto {
  @IsInt()
  id: number;
}
