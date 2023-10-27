import { IsArray, IsString, IsUUID, UUIDVersion } from "class-validator";

export class GoodsAddDto {
  sale_attr: Record<`sale_attr${UUIDVersion}`, string>[];
  
  goods_attr?: Record<`goods_attr${UUIDVersion}`, string>[];
  
  gameId: UUIDVersion
  
  channelId: UUIDVersion
  
  areaId: UUIDVersion
  
  price: number
  
  pics?: string[]
  
  name: string;
}