import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { PermissionAddDto } from './dto/permissionAdd.dto';
import { PermissionService } from './permission.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post('/add')
  @Auth(AuthEnum.SUPER)
  async add(@Body() permissionAddDto: PermissionAddDto) {
    return await this.permissionService.add(permissionAddDto);
  }
}
