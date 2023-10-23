import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, UUIDVersion, Validate } from "class-validator";
import { FormTypeEnum } from "src/common/enum/public.enum";

export class GoodsAttrAddDto {
  @IsString()
  name: string;
  
  @IsNumber()
  type: FormTypeEnum
  
  @IsOptional()
  @Validate(IsString)
  @Validate(IsNumber)
  value: string | number  
  
  @IsOptional()
  @IsNumber()
  minPrice: number;
  
  @IsOptional()
  @IsNumber()
  maxPrice: number;
  
  @IsNumber()
  sort: number;
  
  @IsBoolean()
  isRequired: boolean
  
  @IsOptional()
  @IsArray()
  secondaryAttr: string[];
  
  @IsUUID()
  gameId: UUIDVersion
}