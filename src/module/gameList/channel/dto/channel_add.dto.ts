import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID, UUIDVersion, isUUID } from "class-validator";

export class ChannelAddDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  gameId: UUIDVersion;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  system: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort: number;
}