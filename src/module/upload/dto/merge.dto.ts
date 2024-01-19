import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MergeDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNumber()
  size: number;
}

export class VerifyDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileHash: string;
}
