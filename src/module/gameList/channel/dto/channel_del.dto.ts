import { IsUUID, UUIDVersion } from "class-validator";

export class ChannelDelDto {
  @IsUUID()
  channelId: UUIDVersion
}