import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, UUIDVersion } from "class-validator";

export class SaleAttrViewDto {
  @ApiPropertyOptional({type: 'UUID'})
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
  
  @ApiPropertyOptional()
  @IsString()
  pageSize: number;
  
  @ApiProperty()
  @IsString()
  current: number;
}