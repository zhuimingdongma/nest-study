import { IsNumber, IsOptional, IsString, IsUUID, UUIDVersion, isUUID } from "class-validator";

export class ChannelAddDto {
  @IsUUID()
  gameId: UUIDVersion
  
  @IsString()
  name: string;
  
  @IsString()
  system: string;
  
  @IsOptional()
  @IsNumber()
  sort: number;
}