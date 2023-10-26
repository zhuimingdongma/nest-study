import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { Auth } from "src/common/decorator/auth.decorator";
import { AuthEnum } from "src/common/enum/public.enum";
import { RoleDto, RoleUpdateDto } from './dto/role.dto';
import { RoleService } from "./role.service";
import { ResponseInterceptor } from "src/common/interceptor/response.interceptor";

@Controller('/role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  
  @Auth(AuthEnum.SUPER)
  @Post('/create')
  async create(@Body() roleDto: RoleDto) {
    return await this.roleService.create(roleDto)
  }
  
  @Auth(AuthEnum.SUPER)
  @Post('/update')
  async update (@Body() roleUpdateDto: RoleUpdateDto) {
    return await this.roleService.update(roleUpdateDto)
  }
}