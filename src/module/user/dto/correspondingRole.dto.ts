import { IsUUID, UUIDVersion } from 'class-validator';

export class CorrespondingRoleDto {
  @IsUUID()
  roleId: UUIDVersion;
}
