import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "src/common/decorator/public.decorator";
import { GoodsAddDto } from "./dto/goods_add.dto";
import { GoodsService } from './goods.service';

@Controller("/goods")
export class GoodsController {
  constructor(private goodsService: GoodsService) {}
  
  @Public()
  @Post('/add')
  async add(@Body() goodsAddDto: GoodsAddDto) {
    return await this.goodsService.add(goodsAddDto)
  }
}