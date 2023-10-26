import { IsUUID, UUIDVersion } from "class-validator";

export class GameListFilterDto {
  @IsUUID()
  gameId: UUIDVersion
}