import { IsUUID, UUIDVersion } from "class-validator";
import { SaleAttrAddDto } from "./saleAttr_add.dto";

export class SaleAttrUpdateDto extends SaleAttrAddDto {
  @IsUUID()
  id: UUIDVersion
}