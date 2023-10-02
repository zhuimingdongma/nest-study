import { IsBoolean, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class UserDto {
  @PrimaryGeneratedColumn()
  id:number;
  
  @IsString()
  account: string;
  
  @IsOptional()
  @IsString()
  nickname: string | null;
  
  @IsStrongPassword()
  password: string;
  
}

export class UserLoginDto {
  @IsString()
  account: string;
  
  @IsString()
  password: string;
}