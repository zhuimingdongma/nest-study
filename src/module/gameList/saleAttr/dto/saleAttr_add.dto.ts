import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, UUIDVersion, Validate } from "class-validator";
import { FormTypeEnum, SaleAttrTypeEnum } from "src/common/enum/public.enum";

export class SaleAttrAddDto {
  @IsOptional()
  @IsUUID()
  gameId: UUIDVersion;
  
  @IsOptional()
  @IsNumber()
  saleAttrType: SaleAttrTypeEnum;
  
  @IsOptional()
  @IsNumber()
  type: FormTypeEnum;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @Validate(IsString)
  @Validate(IsNumber)
  value: string | number;
  
  @IsNumber()
  minPrice: number;
  
  @IsNumber()
  maxPrice: number;
  
  @IsNumber()
  sort: number;
  
  @IsBoolean()
  required: boolean;
}