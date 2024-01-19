import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { GoodsAttrAddDto } from './dto/goodsAttrAdd.dto';
import { GoodsAttrService } from './goodsAttr.service';
import { GoodsAttrViewDto } from './dto/goodsAttrView.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { GoodsAttrDeleteDto } from './dto/goodsAttrDelete.dto';
import { UUIDVersion } from 'class-validator';
import { GoodsAttrUpdateDto } from './dto/goodsAttrUpdate.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('/game/goodsAttr')
export class GoodsAttrController {
  constructor(private goodsAttrService: GoodsAttrService) {}

  @Post('/add')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBearerAuth()
  @ApiBody({ type: [GoodsAttrAddDto] })
  async add(@Body() goodsAttrAddDto: GoodsAttrAddDto) {
    return await this.goodsAttrService.add(goodsAttrAddDto);
  }

  @Get('/view')
  @Public()
  @ApiQuery({ type: [GoodsAttrViewDto] })
  async view(@Query() goodsAttrViewDto: GoodsAttrViewDto) {
    return await this.goodsAttrService.view(goodsAttrViewDto);
  }

  @Delete('/delete')
  @ApiBearerAuth()
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiQuery({ type: [GoodsAttrDeleteDto] })
  async delete(@Query() GoodsAttrDeleteDto: GoodsAttrDeleteDto) {
    return await this.goodsAttrService.delete(GoodsAttrDeleteDto);
  }

  @ApiBearerAuth()
  @Post('/update')
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBody({ type: [GoodsAttrUpdateDto] })
  async update(@Body() goodsAttrUpdateDto: GoodsAttrUpdateDto) {
    return await this.goodsAttrService.update(goodsAttrUpdateDto);
  }
}
