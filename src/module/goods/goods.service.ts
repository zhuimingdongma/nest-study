import { InjectRepository } from "@nestjs/typeorm";
import { GoodsEntity } from "./goods.entity";
import { Repository } from "typeorm";
import { GoodsAddDto } from './dto/goods_add.dto';
import { GameListEntity } from "../gameList/gameList.entity";
import { GoodsLevelEnum, GoodsSaleStatusEnum } from "src/common/enum/public.enum";
import { SnowFlake } from "src/common/tools/SnowFlak";
// import Os from 'os'

export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity) private goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(GameListEntity) private gameListRepository: Repository<GameListEntity>
  ) {}
  
  async add(goodsAddDto: GoodsAddDto) {
    const {sale_attr, goods_attr, channelId, areaId, gameId, name, price, pics} = goodsAddDto || {}
    const Os = require('os')
    const network = await Os.networkInterfaces()
    console.log('network: ', network);
    return new SnowFlake(2, 10).nextId()
    // await this.goodsRepository.create({sale_attr, goods_attr, channelId, areaId, 
    //   gameId, name, price, pics: pics ?? undefined, level: GoodsLevelEnum.COMMON, status: GoodsSaleStatusEnum.PENDING_LISTING})
  }
}