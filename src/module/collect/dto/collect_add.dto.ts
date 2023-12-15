import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, UUIDVersion } from "class-validator";

export class CollectAddDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  goodsId: UUIDVersion;
}