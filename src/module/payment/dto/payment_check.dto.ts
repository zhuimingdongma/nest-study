import { IsString } from "class-validator";

export class PaymentCheckDto {
  @IsString()
  bank_number: string;
}