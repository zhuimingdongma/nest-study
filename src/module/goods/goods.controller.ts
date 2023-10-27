import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { Public } from "src/common/decorator/public.decorator";
import { GoodsAddDto } from "./dto/goods_add.dto";
import { GoodsService } from './goods.service';
import { ValidationAttr } from "src/common/pipe/validationAttr.pipe";

@Controller("/goods")
export class GoodsController {
  constructor(private goodsService: GoodsService) {}
  
  @Public()
  @Post('/add')
  @UsePipes(ValidationAttr)
  async add(@Body() goodsAddDto: GoodsAddDto) {
    return await this.goodsService.add(goodsAddDto)
  }
}