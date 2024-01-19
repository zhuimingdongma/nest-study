import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, UUIDVersion } from 'class-validator';

export class CorrespondingRoleDto {
  @ApiProperty({ type: 'UUID' })
  @IsUUID()
  roleId: UUIDVersion;
}
