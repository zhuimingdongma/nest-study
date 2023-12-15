import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class AreaUpdateDto {
  @ApiProperty({type: 'uuid'})
  @IsUUID()
  areaId: UUIDVersion;

  @ApiPropertyOptional({type: 'uuid'})
  @IsOptional()
  @IsUUID()
  channelId: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort: number;
}
