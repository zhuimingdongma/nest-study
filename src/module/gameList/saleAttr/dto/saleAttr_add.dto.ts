import { IsBoolean, IsNumber, IsNumberString, IsString, IsUUID, UUIDVersion, Validate } from "class-validator";
import { FormTypeEnum, SaleAttrTypeEnum } from "src/common/enum/public.enum";

export class SaleAttrAddDto {
  @IsUUID()
  gameId: UUIDVersion;
  
  @IsNumber()
  saleAttrType: SaleAttrTypeEnum;
  
  @IsNumber()
  type: FormTypeEnum;
  
  @IsString()
  name: string;
  
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