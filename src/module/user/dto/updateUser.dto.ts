import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  account: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  nickname?: string | null;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
