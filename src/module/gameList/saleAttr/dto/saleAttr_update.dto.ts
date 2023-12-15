import { IsUUID, UUIDVersion } from "class-validator";
import { SaleAttrAddDto } from "./saleAttr_add.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SaleAttrUpdateDto extends SaleAttrAddDto {
  @ApiProperty({type: 'UUID'})
  @IsUUID()
  id: UUIDVersion
}