import { IsDate, IsISO8601, IsNumber, IsOptional, IsPhoneNumber, IsString, IsTimeZone, IsUUID, UUIDVersion } from "class-validator";
import { GoodsSaleStatusEnum } from "src/common/enum/public.enum";

export class GoodsViewAllDto {
  @IsString()
  currentPage: number;
  
  @IsString()
  pageSize: number;
  
  @IsOptional()
  @IsString()
  no: string;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsNumber()
  status: GoodsSaleStatusEnum
  
  @IsOptional()
  @IsUUID()
  seller_id: UUIDVersion;
  
  @IsOptional()
  @IsPhoneNumber()
  phone: number;
  
  @IsOptional()
  @IsString()
  gameName: string;
  
  @IsOptional()
  @IsString()
  channelName: string;
  
  @IsOptional()
  @IsISO8601()
  startedTime: Date;
  
  @IsOptional()
  @IsISO8601()
  endTime: Date;
}