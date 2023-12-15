import {
  IsDate,
  IsEnum,
  IsISO8601,
  IsInt,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsTimeZone,
  IsUUID,
  UUIDVersion,
} from 'class-validator';
import {
  GoodsLevelEnum,
  GoodsSaleStatusEnum,
} from 'src/common/enum/public.enum';

export class GoodsViewAllDto {
  @IsInt()
  currentPage: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  no: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(GoodsSaleStatusEnum)
  status: GoodsSaleStatusEnum;

  @IsOptional()
  @IsEnum(GoodsLevelEnum)
  level: GoodsLevelEnum;

  @IsOptional()
  @IsUUID()
  seller_id: UUIDVersion;

  @IsOptional()
  @IsMobilePhone()
  phone: number;

  @IsOptional()
  @IsString()
  gameName: string;

  @IsOptional()
  @IsString()
  channelName: string;

  @IsOptional()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsISO8601()
  startedTime: Date;

  @IsOptional()
  @IsISO8601()
  endTime: Date;
}
