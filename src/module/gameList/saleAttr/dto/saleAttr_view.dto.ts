import { IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class SaleAttrViewDto {
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsString()
  pageSize: number;
  
  @IsString()
  current: number;
}