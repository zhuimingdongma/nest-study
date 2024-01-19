import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { File } from 'buffer';
import {
  IsArray,
  IsMimeType,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class AreaAddDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  id: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort: number;

  @ApiPropertyOptional({ type: 'file' })
  @IsOptional()
  file: File;
}
