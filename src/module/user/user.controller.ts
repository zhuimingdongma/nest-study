import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { UserDto, UserLoginDto } from './dto/user.dto';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import type { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { checkAuthGuard } from 'src/common/guard/check_auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { SchemaFieldTypes, createClient } from 'redis';

@Controller('/user')
export class UserController {
  constructor(
    readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
  ) {}

  @CacheKey('user_all')
  @CacheTTL(5000)
  // @Public()
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

  @Get('/test')
  @Public()
  async test() {
    try {
      const client = createClient();
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();
      await client.ft.create(
        'idx:users',
        {
          '$.name': {
            type: SchemaFieldTypes.TEXT,
            SORTABLE: true,
          },
          '$.city': {
            type: SchemaFieldTypes.TEXT,
            AS: 'city',
          },
          '$.age': {
            type: SchemaFieldTypes.NUMERIC,
            AS: 'age',
          },
        },
        {
          ON: 'JSON',
          PREFIX: 'user:',
        },
      );
      await Promise.all([
        client.json.set('user:1', '$', {
          name: 'Paul John',
          email: 'paul.john@example.com',
          age: 42,
          city: 'London',
        }),
        client.json.set('user:2', '$', {
          name: 'Eden Zamir',
          email: 'eden.zamir@example.com',
          age: 29,
          city: 'Tel Aviv',
        }),
      ]);
      const result = await client.ft.search('idx:users', ' Paul @age:[30, 40]');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      if (e.message === 'Index already exists') {
        console.log('Index exists already, skipped creation.');
      } else {
        // Something went wrong, perhaps RediSearch isn't installed...
        console.error(e);
        process.exit(1);
      }
    }

    // await client.ft.create('idx:users', {
    //   '$.name': {
    //     type: SchemaFieldTypes.TEXT,
    //     SORTABLE: true
    //   },
    //   '$.city': {
    //     type: SchemaFieldTypes.TEXT,
    //     AS: 'city'
    //   },
    //   '$.age': {
    //     type: SchemaFieldTypes.NUMERIC,
    //     AS: 'age'
    //   }
    // },
    //   {
    //     ON: 'JSON',
    //     PREFIX: 'user:'
    //   })
  }
}
