import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VideoTestDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  path: string;
}
