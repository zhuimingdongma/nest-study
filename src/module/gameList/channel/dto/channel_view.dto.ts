import { IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class ChannelViewDto {
  @IsUUID()
  gameId: UUIDVersion
  
  @IsOptional()
  @IsString()
  system: string;
  
  @IsOptional()
  @IsString()
  name: string;
}