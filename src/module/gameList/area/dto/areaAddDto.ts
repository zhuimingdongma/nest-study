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
  // @IsUUID()
  id: UUIDVersion;

  // @IsOptional()
  // @IsString()
  name: string;

  // @IsOptional()
  // @IsNumber()
  sort: number;

  // @IsOptional()
  // @IsMimeType()
  file: File;
}
