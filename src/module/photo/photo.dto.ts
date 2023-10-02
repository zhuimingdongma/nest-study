import { IsBoolean, IsInt, IsNumber, IsString } from "class-validator";


export class CreatePhotoDto {
  @IsNumber()
  id: number;
  
  @IsString()
  name: string;
  
  @IsString()
  description: string;
  
  @IsString()
  filename: string;
  
  @IsInt()
  views: number;
  
  @IsBoolean()
  isPublished: boolean;
}