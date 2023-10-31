import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min, UUIDVersion, Validate } from "class-validator";
import { FormTypeEnum } from "src/common/enum/public.enum";

export class GoodsAttrUpdateDto {
  @IsUUID()
  id: UUIDVersion
  
  @IsOptional()
  @IsNumber()
  type: FormTypeEnum
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice: number;
  
  @IsOptional()
  @IsNumber()
  sort: number;
  
  @IsOptional()
  @IsBoolean()
  isRequired: boolean;
  
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @Validate(IsString)
  @Validate(IsArray)
  value: string;
}