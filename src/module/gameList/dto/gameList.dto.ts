import { IsUUID, UUIDVersion, IsString, isTimeZone, IsNumber, IsArray } from "class-validator";
import { WhetherEnum } from "src/common/enum/public.enum";

export class GameListDto {
  
  @IsUUID()
  id: UUIDVersion
  
  @IsString()
  name: string;
  
  @IsString()
  icon: string;
  
  @IsNumber()
  type: WhetherEnum
  
  @IsNumber()
  status: WhetherEnum
  
  @IsNumber()
  sort: number;
  
  @IsArray()
  label: string[];
}

export interface AgentType {
  id: number;
  name: string;
}

export interface PowerBtnType {
  agent: WhetherEnum
  // 卖单属性
  sell: WhetherEnum
  goods: WhetherEnum
  del: WhetherEnum
  edit: WhetherEnum
  channel: WhetherEnum
}