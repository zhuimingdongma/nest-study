import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class UserDto {
  @PrimaryGeneratedColumn()
  id:number;
  
  @IsString({message: "account 类型错误"})
  @IsNotEmpty()
  account: string;
  
  @IsOptional()
  @IsString()
  nickname: string | null;
  
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
  
}

export class UserLoginDto {
  @IsString()
  account: string;
  
  @IsString()
  password: string;
}

