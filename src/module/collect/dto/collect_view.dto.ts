import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CollectViewDto {
  @ApiProperty()
  @IsString()
  currentPage: number;

  @ApiProperty()
  @IsString()
  pageSize: number;
}
