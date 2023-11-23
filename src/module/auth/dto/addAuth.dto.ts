import { IsArray, IsOptional, IsUUID, UUIDVersion } from 'class-validator';

export class AddAuthDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsUUID()
  roleId: UUIDVersion;

  @IsOptional()
  @IsUUID()
  permissionId: UUIDVersion;
  
  @IsOptional()
  @IsArray()
  userIdList: UUIDVersion[];
}
