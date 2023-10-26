import { IsUUID, UUIDVersion } from "class-validator";

export class GoodsAttrDeleteDto {
  @IsUUID()
  id: UUIDVersion;
}