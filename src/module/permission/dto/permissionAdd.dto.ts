import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PermissionAddDto {
  @ApiProperty()
  @IsString()
  name: string;
}
