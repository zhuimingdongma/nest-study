import { Body, Controller, Get, Header, HttpCode, UseInterceptors, Param, Post, Query, Req, HttpException, HttpStatus, UseFilters, BadRequestException, ForbiddenException, ParseIntPipe, ParseUUIDPipe, UsePipes, UseGuards } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Request } from 'express';
import { CreateCatDto, CreateCatSchema } from 'src/dto/cats.dto';
import { HttpExceptionFilter } from 'src/common/error/http-exception.filter';
import { ZodValidationPipe } from 'src/common/pipe/zodValidationPipe';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { ParseIntValidationPipe } from 'src/common/pipe/parseIntValidation.pipe';
import { rolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { TimeoutInterceptor } from 'src/common/interceptor/timeout.interceptor';
import { User } from 'src/common/decorator/user.decorator';


@Controller({path:'cats'})
@Roles(['admin'])
// @UseInterceptors(new TransformInterceptor())
@UseInterceptors(new TimeoutInterceptor())
// @UseInterceptors(new LoggingInterceptor())
// @UseGuards(new rolesGuard())
export class CatsController { 
  constructor(private cats: CatsService) {}
  // @Get(':id') 
  // // @UseFilters(new HttpExceptionFilter)
  // findAll(@Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id: number) {
  //   // throw new ForbiddenException()
  //   // const str = this.cats.getAll()
  //   // throw new HttpException({error: 'ddd哒哒哒', status: '失败'}, HttpStatus.FORBIDDEN)
    
  //   return this.cats.getCats(id);
  //   // return `This is a Cats`
  // }
  
  // @Get(':uuid')
  // findOne(@Param('uuid', new ParseUUIDPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) uuid: string) {
  //   return 'true'
  // }
  
  // @Get('/:id')
  // getOne(@Param('id') id: number) {
  //   return `this id is ${id}`
  // }
  @Get('')
  getAll() {
    // return this.cats;
  }
  @Post('/create')
  @HttpCode(200) 
  @Header('Cache-controller', 'none')
  // @UsePipes(new ValidationPipe())
  // @UsePipes(new ZodValidationPipe(CreateCatSchema))
  create(@Body(new ParseIntValidationPipe()) createCatDto: CreateCatDto) {
    this.cats.create(createCatDto)
    console.log('this.cats.getAll(): ', this.cats.getAll());
    // this.cats.create({'name':'猫猫', id: 1, breed: 'ddd'}) 
    return '创建成功'
  }
}
