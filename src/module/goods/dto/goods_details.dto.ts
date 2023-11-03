import { IsUUID, UUIDVersion } from "class-validator";

export class GoodsDetailsDto {
  @IsUUID()
  id: UUIDVersion
}