import { IsUUID, UUIDVersion, IsString, isTimeZone, IsNumber, IsArray } from "class-validator";
import { WhetherEnum } from "src/common/enum/public.enum";

export class GameListAddDto {
  
  @IsString()
  name: string;
  
  @IsString()
  icon: string;
  
  @IsNumber()
  status: WhetherEnum
  
  @IsNumber()
  type: WhetherEnum
  
  @IsNumber()
  sort: number;
  
  @IsArray()
  label: string[]
}