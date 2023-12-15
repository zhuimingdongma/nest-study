import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min, UUIDVersion, Validate } from "class-validator";
import { FormTypeEnum } from "src/common/enum/public.enum";

export class GoodsAttrUpdateDto {
  @ApiProperty({ type: 'uuid' })
  @IsUUID()
  id: UUIDVersion;

  @ApiPropertyOptional({ enum: FormTypeEnum })
  @IsOptional()
  @IsNumber()
  type: FormTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRequired: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({type: 'string or array'})
  @IsOptional()
  @Validate(IsString)
  @Validate(IsArray)
  value: string;
}