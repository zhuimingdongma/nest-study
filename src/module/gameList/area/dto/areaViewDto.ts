import { IsNumber, IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class AreaViewDto {
  @IsOptional()
  @IsUUID()
  areaId: UUIDVersion
  
  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion
  
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion
  
  @IsOptional()
  @IsString()
  areaName: string;
  
  @IsOptional()
  @IsString()
  channelName: string;
  
  @IsOptional()
  @IsString()
  gameName: string;
  
  @IsString()
  current: number;
  
  @IsString()
  pageSize: number;
}