import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import { GoodsSaleStatusEnum } from 'src/common/enum/public.enum';

export class OrderViewDto {
  @IsOptional()
  @IsUUID()
  orderId: UUIDVersion;

  @IsOptional()
  @IsString()
  orderNo: string;

  @IsOptional()
  @IsString()
  goodsNo: string;

  @IsOptional()
  @IsString()
  goodsName: string;

  @IsOptional()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsUUID()
  goodsId: UUIDVersion;

  @IsOptional()
  @IsUUID()
  seller_id: UUIDVersion;

  @IsOptional()
  @IsNumber()
  seller_num: number;

  @IsOptional()
  @IsNumber()
  sell_num: number;

  @IsOptional()
  @IsUUID()
  sell_id: UUIDVersion;

  @IsOptional()
  @IsEnum(GoodsSaleStatusEnum)
  status: GoodsSaleStatusEnum;

  @IsOptional()
  @IsISO8601()
  createdTime: Date;

  @IsOptional()
  @IsISO8601()
  updateTime: Date;

  @IsOptional()
  @IsISO8601()
  statusCreatedTime: Date;

  @IsOptional()
  @IsISO8601()
  statusUpdateTime: Date;
}
