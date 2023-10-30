import { Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes } from "@nestjs/common";
import { Public } from "src/common/decorator/public.decorator";
import { GoodsAddDto } from "./dto/goods_add.dto";
import { GoodsService } from './goods.service';
import { ValidationAttr } from "src/common/pipe/validationAttr.pipe";
import { AuthGuard } from "src/common/guard/auth.guard";
import { UserRequest } from "src/common/types/global";
import { GoodsViewOneDto } from "./dto/goods_view.dto";

@Controller("/goods")
export class GoodsController {
  constructor(private goodsService: GoodsService) {}
  
  @Post('/add')
  @UsePipes(ValidationAttr)
  async add(@Body() goodsAddDto: GoodsAddDto, @Request() req: UserRequest) {
    return await this.goodsService.add(goodsAddDto, req.user.sub)
  }
  
  @Get('/view/one')
  async getOne(@Query() goodsViewDto: GoodsViewOneDto) {
    const {id} = goodsViewDto
    return await this.goodsService.viewOne(id)
  }
}