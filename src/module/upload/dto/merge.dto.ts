import { IsNumber, IsString } from 'class-validator';

export class MergeDto {
  @IsString()
  fileName: string;

  @IsNumber()
  size: number;
}

export class VerifyDto {
  @IsString()
  fileName: string;
  
  @IsString()
  fileHash: string;
}