import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, UUIDVersion } from "class-validator";

export class RoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  permissionId: UUIDVersion;
}

export class RoleUpdateDto {
  @ApiProperty()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  name: string;
}