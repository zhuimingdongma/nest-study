import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, UUIDVersion } from "class-validator";

export class ChannelDelDto {
  @ApiProperty({type: 'uuid'})
  @IsUUID()
  channelId: UUIDVersion;
}