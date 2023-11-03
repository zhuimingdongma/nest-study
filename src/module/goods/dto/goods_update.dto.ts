import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";
import { GoodsLevelEnum, GoodsSaleStatusEnum } from "src/common/enum/public.enum";

export class GoodsUpdateDto {
  @IsOptional()
  @IsArray()
  saleAttr: string
  
  @IsOptional()
  @IsArray()
  goodsAttr: string
  
  @IsOptional()
  @IsArray()
  pics: string[];
  
  @IsOptional()
  @IsEnum(GoodsLevelEnum)
  level: GoodsLevelEnum
  
  @IsOptional()
  @IsEnum(GoodsSaleStatusEnum)
  status: GoodsSaleStatusEnum
  
  @IsOptional()
  @IsArray()
  label: string[]
  
  @IsOptional()
  @IsUUID()
  areaId: UUIDVersion
  
  @IsUUID()
  id: UUIDVersion
}