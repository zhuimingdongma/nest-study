import { IsOptional, IsString } from 'class-validator';

export class UploadDto {
  @IsOptional()
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  hash: string;
}
