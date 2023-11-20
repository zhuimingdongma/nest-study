import { IsOptional, IsUUID, UUIDVersion } from 'class-validator';

export class AreaDelDto {
  @IsOptional()
  @IsUUID()
  areaId: UUIDVersion;

  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion;
}
