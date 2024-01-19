import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class ChannelUpdateDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  id: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  system: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort: number;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;
}
