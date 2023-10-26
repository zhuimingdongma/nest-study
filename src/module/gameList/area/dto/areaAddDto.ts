import { IsArray, IsNumber, IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class AreaAddDto {
  @IsUUID()
  id: UUIDVersion
  
  @IsString()
  name: string;
  
  @IsOptional()
  @IsNumber()
  sort: number;
}