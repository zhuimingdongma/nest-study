import { IsNumber, IsString } from "class-validator";

export class GameListLookDto {
  @IsNumber()
  currentPage: number;
  
  @IsNumber()
  pageSize: number;
  
  @IsString()
  search: string;
}