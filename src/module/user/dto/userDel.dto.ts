import {
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  UUIDVersion,
  Validate,
} from 'class-validator';

export class UserDeleteDto {
  @IsOptional()
  @Validate(IsUUID)
  @Validate(IsNumber)
  id: UUIDVersion | number;

  @IsOptional()
  @IsArray()
  userList: UUIDVersion[] | number[];
}
