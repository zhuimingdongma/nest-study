import { IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class GoodsAttrViewDto {
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion
  
  @IsOptional()
  @IsString()
  gameName: string
  
  @IsOptional()
  @IsString()
  GoodsAttrName: string
}