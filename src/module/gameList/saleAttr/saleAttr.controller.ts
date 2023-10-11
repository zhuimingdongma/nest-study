import {Body, Controller, Get, Inject, Param, Post, Query, UseInterceptors} from '@nestjs/common'
import { Auth } from 'src/common/decorator/auth.decorator'
import { AuthEnum } from 'src/common/enum/public.enum'
import { SaleAttrAddDto } from './dto/saleAttr_add.dto';
import { SaleAttrService } from './saleAttr.service';
import { UUIDVersion } from 'class-validator';
import { SaleAttrDelDto } from './dto/saleAttr_del.dto';
import { SaleAttrUpdateDto } from './dto/saleAttr_update.dto';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { Public } from 'src/common/decorator/public.decorator';
import { SaleAttrViewDto } from './dto/saleAttr_view.dto';

@Controller('/game/saleAttr')
export class SaleAttrController {
  
  constructor(private saleAttrService: SaleAttrService ) {}
  @Post('/add')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  
  async add(@Body() saleAttrAddDto: SaleAttrAddDto) {
    return await this.saleAttrService.add(saleAttrAddDto)
  }
  
  @Post('/delete')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async delete(@Body() saleAttrDelDto: SaleAttrDelDto) {
    const {id} = saleAttrDelDto
    return await this.saleAttrService.delete(id)
  }
  
  @Post('/update')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @UseInterceptors(ResponseInterceptor)
  async update(@Body() saleAttrUpdateDto: SaleAttrUpdateDto) {
    return await this.saleAttrService.update(saleAttrUpdateDto)
  }
  
  @Get('/all')
  @Public()
  async view(@Query() saleAttrViewDto: SaleAttrViewDto) {
    const {gameId, name} = saleAttrViewDto
    return await this.saleAttrService.view(gameId, name)
  }  
}