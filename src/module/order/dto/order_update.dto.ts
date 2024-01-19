import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { OrderStatusEnum } from "src/common/enum/public.enum";

export class OrderUpdateDto {
  
  @IsOptional()
  @IsArray()
  pics: string[]
  
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum
}