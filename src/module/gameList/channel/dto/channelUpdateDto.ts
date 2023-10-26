import { IsNumber, IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class ChannelUpdateDto {
  @IsUUID()
  id: UUIDVersion
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  system: string;
  
  @IsOptional()
  @IsNumber()
  sort: number;
  
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion
}