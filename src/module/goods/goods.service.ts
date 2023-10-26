import { InjectRepository } from "@nestjs/typeorm";
import { GoodsEntity } from "./goods.entity";
import { Repository } from "typeorm";
import { GoodsAddDto } from './dto/goods_add.dto';

export class GoodsService {
  constructor(@InjectRepository(GoodsEntity) private goodsRepository: Repository<GoodsEntity>) {}
  
  async add(goodsAddDto: GoodsAddDto) {
    
  }
}