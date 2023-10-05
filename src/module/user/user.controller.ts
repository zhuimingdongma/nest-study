import {Controller, Get, Param, Post, Body, UseGuards, Req} from '@nestjs/common'
import { UserService } from './user.service'
import type { UserDto, UserLoginDto } from './dto/user.dto'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import type { UpdateUserDto } from './dto/updateUser.dto'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { Public } from 'src/common/decorator/public.decorator'
import { checkAuthGuard } from 'src/common/guard/check_auth.guard'
import { Roles } from 'src/common/decorator/role.decorator'
import { AuthEnum } from 'src/common/enum/public.enum'
import {Request} from 'express'

@Controller('/user')
export class UserController {
  
  constructor(readonly userService: UserService) {}
  
  @CacheKey('user_all')
  @CacheTTL(5000)
  // @Public()
  @Get('/all')
  findAll() {
    return this.userService.findAll()
  }
  
  @Get('/find')
  // @Roles([AuthEnum.ADMIN, AuthEnum.SUPER])
  // @UseGuards(checkAuthGuard)
  findOne(@Param() account: string) {
    return 'ds'
    // return this.userService.findOne(account)
  }
  
  @Post('/register')
  @Public()
  create(@Body() userDto: UserDto) {
    return this.userService.register(userDto)
  }
  
  @UseGuards(AuthGuard)
  @Post('/update')
  update(@Body() userDto: UpdateUserDto) {
    return this.userService.update(userDto)
  }
  
  @Get("/info")
  @Public()
  @UseGuards(AuthGuard)
  getInfo(@Req() request: Request) {
    return this.userService.getUserInfo(request.headers.authorization!)
  }
}