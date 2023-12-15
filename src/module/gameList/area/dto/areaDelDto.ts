import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, UUIDVersion } from 'class-validator';

export class AreaDelDto {
  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  areaId: UUIDVersion;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion;
}
