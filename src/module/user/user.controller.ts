import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Inject,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { UserDto, UserLoginDto } from './dto/user.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import type { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { checkAuthGuard } from 'src/common/guard/check_auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { SchemaFieldTypes, createClient } from 'redis';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserDeleteDto } from './dto/userDel.dto';
import { CorrespondingRoleDto } from './dto/correspondingRole.dto';

@Controller('/user')
export class UserController {
  constructor(
    readonly userService: UserService, // @Inject(CACHE_MANAGER) private cacheManger: Cache,
  ) {}

  @Delete('/del')
  @Auth(AuthEnum.SUPER, AuthEnum.ADMIN)
  async delete(@Body() userDeleteDto: UserDeleteDto) {
    return await this.userService.delete(userDeleteDto);
  }

  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/find')
  // @Roles([AuthEnum.ADMIN, AuthEnum.SUPER])
  // @UseGuards(checkAuthGuard)
  findOne(@Param() account: string) {
    return 'ds';
    // return this.userService.findOne(account)
  }

  @Post('/register')
  @Public()
  create(@Body() userDto: UserDto) {
    return this.userService.register(userDto);
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  update(@Body() userDto: UpdateUserDto) {
    return this.userService.update(userDto);
  }

  @Get('/info')
  @Public()
  @UseGuards(AuthGuard)
  getInfo(@Req() request: Request) {
    return this.userService.getUserInfo(request.headers.authorization!);
  }

  @Get('/role')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async getRoleCorrespondingUser(
    @Query() correspondingRoleDto: CorrespondingRoleDto,
  ) {
    return await this.userService.getRoleCorrespondingUser(
      correspondingRoleDto,
    );
  }
}
