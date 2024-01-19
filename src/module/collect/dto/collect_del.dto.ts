import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, Validate } from 'class-validator';

export class CollectDelDto {
  @ApiPropertyOptional({ type: 'number[]' })
  @IsArray()
  id: number[];
}
