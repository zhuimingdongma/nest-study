import { IsUUID, UUIDVersion } from "class-validator";

export class GoodsViewOneDto {
  @IsUUID()
  id: UUIDVersion
}