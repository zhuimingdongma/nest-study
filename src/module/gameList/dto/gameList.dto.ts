import { IsUUID, UUIDVersion, IsString, isTimeZone } from "class-validator";

export class GameListDto {
  
  @IsUUID()
  id: UUIDVersion
  
  @IsString()
  name: string;
  
  @IsString()
  icon: string;
  
}