import { IsMimeType } from 'class-validator';

export class UploadDto {
  @IsMimeType()
  file: File;
}
