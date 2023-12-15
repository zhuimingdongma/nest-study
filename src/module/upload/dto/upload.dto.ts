import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filename: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hash: string;
}
