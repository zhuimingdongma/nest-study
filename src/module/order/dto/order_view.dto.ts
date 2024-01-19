import {
  IsEnum,
  IsISO8601,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import {
  GoodsSaleStatusEnum,
  OrderStatusEnum,
} from 'src/common/enum/public.enum';

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
  @IsMobilePhone()
  seller_num: string;

  @IsOptional()
  @IsMobilePhone()
  buyer_num: string;

  @IsOptional()
  @IsUUID()
  buyer_id: UUIDVersion;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsOptional()
  @IsISO8601()
  createdTime: Date;

  @IsOptional()
  @IsISO8601()
  updatedTime: Date;

  @IsOptional()
  @IsISO8601()
  statusCreatedTime: Date;

  @IsOptional()
  @IsISO8601()
  statusUpdatedTime: Date;
}
