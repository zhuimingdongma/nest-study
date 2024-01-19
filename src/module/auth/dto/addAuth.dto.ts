import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID, UUIDVersion } from 'class-validator';

export class AddAuthDto {
  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  roleId: UUIDVersion;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsUUID()
  permissionId: UUIDVersion;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  @IsArray()
  userIdList: UUIDVersion[];
}
