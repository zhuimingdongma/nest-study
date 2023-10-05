import { IsUUID, UUIDVersion, IsString, isTimeZone } from "class-validator";

export class GameListAddDto {
  
  @IsString()
  name: string;
  
  @IsString()
  icon: string;
  
}