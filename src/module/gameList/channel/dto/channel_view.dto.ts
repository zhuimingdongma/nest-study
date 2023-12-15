import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, UUIDVersion } from 'class-validator';

export class ChannelViewDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  gameId: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  system: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  current: number;

  @ApiProperty()
  @IsString()
  pageSize: number;
}
