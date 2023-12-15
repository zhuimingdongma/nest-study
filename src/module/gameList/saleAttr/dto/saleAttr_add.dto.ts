import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
  Validate,
} from 'class-validator';
import { FormTypeEnum, SaleAttrTypeEnum } from 'src/common/enum/public.enum';

export class SaleAttrAddDto {
  @ApiPropertyOptional({ type: 'UUID' })
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;

  @ApiPropertyOptional({ enum: SaleAttrTypeEnum })
  @IsOptional()
  @IsNumber()
  saleAttrType: SaleAttrTypeEnum;

  @ApiPropertyOptional({ enum: FormTypeEnum })
  @IsOptional()
  @IsNumber()
  type: FormTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: 'value or number' })
  @IsOptional()
  @Validate(IsString)
  @Validate(IsNumber)
  value: string | number;

  @ApiProperty()
  @IsNumber()
  minPrice: number;

  @ApiProperty()
  @IsNumber()
  maxPrice: number;

  @ApiProperty()
  @IsNumber()
  sort: number;

  @ApiProperty()
  @IsBoolean()
  required: boolean;
}
