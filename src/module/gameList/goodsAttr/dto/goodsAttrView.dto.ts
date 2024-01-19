import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, UUIDVersion } from 'class-validator';

export class GoodsAttrViewDto {
  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gameName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  GoodsAttrName: string;

  @ApiProperty()
  @IsString()
  current: number;

  @ApiProperty()
  @IsString()
  pageSize: number;
}
