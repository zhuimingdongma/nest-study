import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class AreaViewDto {
  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  areaId: UUIDVersion;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channelName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gameName: string;

  @ApiProperty()
  @IsString()
  current: number;

  @ApiProperty()
  @IsString()
  pageSize: number;
}
