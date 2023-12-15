import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
  Validate,
} from 'class-validator';
import { FormTypeEnum } from 'src/common/enum/public.enum';

export class GoodsAttrAddDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FormTypeEnum })
  @IsNumber()
  type: FormTypeEnum;

  @ApiPropertyOptional({ type: 'string or number' })
  @IsOptional()
  @Validate(IsString)
  @Validate(IsNumber)
  value: string | number;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @ApiProperty()
  @IsNumber()
  sort: number;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  secondaryAttr: string[];

  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  gameId: UUIDVersion;
}
