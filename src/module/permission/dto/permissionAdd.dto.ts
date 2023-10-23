import { IsString } from "class-validator";

export class PermissionAddDto {
  @IsString()
  name: string;
}