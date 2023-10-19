import { IsUUID, UUIDVersion } from "class-validator";

export class AddAuthDto {
  @IsUUID()
  id: UUIDVersion
  
  @IsUUID()
  roleId: UUIDVersion
  
  @IsUUID()
  permissionId: UUIDVersion
}