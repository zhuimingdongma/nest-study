import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";
import { WhetherEnum } from "src/common/enum/public.enum";

export class GameListLookDto {
  @IsNumber()
  currentPage: number;
  
  @IsNumber()
  pageSize: number;
  
  @IsOptional()
  @IsString()
  search: string;
  
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion
  
  @IsOptional()
  @IsNumber()
  status: WhetherEnum;
}