import {Body, Controller, Delete, Get, Param, Post, Query, UseGuards} from '@nestjs/common'
import { Auth } from 'src/common/decorator/auth.decorator'
import { AuthEnum } from 'src/common/enum/public.enum'
import { GoodsAttrAddDto } from './dto/goodsAttrAdd.dto';
import { GoodsAttrService } from './goodsAttr.service';
import { GoodsAttrViewDto } from './dto/goodsAttrView.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { GoodsAttrDeleteDto } from './dto/goodsAttrDelete.dto';
import { UUIDVersion } from 'class-validator';

@Controller('/game/goodsAttr')
export class GoodsAttrController {
  constructor(private goodsAttrService: GoodsAttrService) {}
  
  @Post('/add')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async add(@Body() goodsAttrAddDto: GoodsAttrAddDto) {
    return await this.goodsAttrService.add(goodsAttrAddDto)
  }
  
  @Get('/view')
  @Public()
  async view(@Query() goodsAttrViewDto: GoodsAttrViewDto) {
    return await this.goodsAttrService.view(goodsAttrViewDto)
  }
  
  @Delete("/delete")
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  async delete(@Query() GoodsAttrDeleteDto: GoodsAttrDeleteDto) {
    return await this.goodsAttrService.delete(GoodsAttrDeleteDto)
  }
  
}