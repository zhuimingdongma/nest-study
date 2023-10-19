import { IsString, IsUUID, UUIDVersion } from "class-validator";

export class RoleDto {
  @IsString()
  name: string;
  
  @IsUUID()
  permissionId: UUIDVersion
}

export class RoleUpdateDto {
  @IsUUID()
  id: UUIDVersion
  
  @IsString()
  name: string;
}