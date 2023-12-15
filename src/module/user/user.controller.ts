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
import { UpdateUserDto } from './dto/updateUser.dto';
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
import { IPRequest } from 'src/common/types/global';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('/user')
export class UserController {
  constructor(
    readonly userService: UserService, // @Inject(CACHE_MANAGER) private cacheManger: Cache,
  ) {}

  @Delete('/del')
  @Auth(AuthEnum.SUPER, AuthEnum.ADMIN)
  @ApiBody({ type: [UserDeleteDto] })
  @ApiBearerAuth()
  async delete(@Body() userDeleteDto: UserDeleteDto) {
    return await this.userService.delete(userDeleteDto);
  }

  @Public()
  @Get('/all')
  findAll(@Req() request: IPRequest) {
    return this.userService.findAll(request);
  }

  // @Get('/find')
  // // @Roles([AuthEnum.ADMIN, AuthEnum.SUPER])
  // // @UseGuards(checkAuthGuard)
  // findOne(@Param() account: string) {
  //   return 'ds';
  //   // return this.userService.findOne(account)
  // }

  // @Post('/register')
  // @Public()
  // async create(@Body() userDto: UserDto) {
  //   return await this.userService.register(userDto);
  // }

  @UseGuards(AuthGuard)
  @Post('/update')
  @ApiBearerAuth()
  @ApiBody({ type: [UpdateUserDto] })
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
  @ApiBearerAuth()
  @ApiQuery({ type: [CorrespondingRoleDto] })
  async getRoleCorrespondingUser(
    @Query() correspondingRoleDto: CorrespondingRoleDto,
  ) {
    return await this.userService.getRoleCorrespondingUser(
      correspondingRoleDto,
    );
  }
}
