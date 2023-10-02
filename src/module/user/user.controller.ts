import {Controller, Get, Param, Post, Body} from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto, UserLoginDto } from './user.dto'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { UpdateUserDto } from './updateUser.dto'

@Controller('/user')
export class UserController {
  
  constructor(readonly userService: UserService) {}
  
  @CacheKey('user_all')
  @CacheTTL(5000)
  @Get('/all')
  findAll() {
    return this.userService.findAll()
  }
  
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id)
  }
  
  @Post('/create')
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto)
  }
  
  @Post('/update')
  update(@Body() userDto: UpdateUserDto) {
    return this.userService.update(userDto)
  }
  
  // 
// '10.2.6.66 jenkins.tsy.com
  @Post('/login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto)
  }
}