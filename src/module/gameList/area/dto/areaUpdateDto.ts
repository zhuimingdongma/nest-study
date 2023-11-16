import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class AreaUpdateDto {
  @IsUUID()
  areaId: UUIDVersion;

  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  sort: number;
}
