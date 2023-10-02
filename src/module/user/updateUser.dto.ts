import { IsBoolean, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class UpdateUserDto {
  @IsNumber()
  id:number;
  
  @IsString()
  account: string;
  
  @IsOptional()
  @IsString()
  nickname: string | null;
  
  @IsStrongPassword()
  password: string;
  
}