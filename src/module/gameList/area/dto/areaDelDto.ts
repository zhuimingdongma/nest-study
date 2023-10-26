import { IsUUID, UUIDVersion } from "class-validator";

export class AreaDelDto {
  @IsUUID()
  areaId: UUIDVersion
}