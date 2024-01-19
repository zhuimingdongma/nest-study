import { IsUUID, UUIDVersion } from 'class-validator';

export class GoodsPaymentDto {
  @IsUUID()
  goodsId: UUIDVersion;
}
