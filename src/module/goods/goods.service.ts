import { InjectRepository } from "@nestjs/typeorm";
import { GoodsEntity } from "./goods.entity";
import { Repository } from "typeorm";
import { GoodsAddDto } from './dto/goods_add.dto';
import { GameListEntity } from "../gameList/gameList.entity";
import { GoodsLevelEnum, GoodsSaleStatusEnum } from "src/common/enum/public.enum";
import { SnowFlake } from "src/common/tools/SnowFlak";
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { User } from "../user/user.entity";
import { UUIDVersion } from "class-validator";
import { UserService } from "../user/user.service";
import { Tools } from "src/common/tools/tools";
import { SaleAttrEntity } from "../gameList/saleAttr/saleAttr.entity";
// import Os from 'os'

export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity) private goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService
  ) {}
  
  async add(goodsAddDto: GoodsAddDto, id: UUIDVersion) {
    try {
      const {sale_attr, goods_attr, channelId, areaId, gameId, name, price, pics} = goodsAddDto || {}
      const no = new SnowFlake(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)).nextId()
      const seller = await this.userService.getUserInfo(undefined, id) as User
      await this.goodsRepository.createQueryBuilder('goods').insert().into(GoodsEntity).values({sale_attr: JSON.stringify(sale_attr), goods_attr: JSON.stringify(goods_attr), channelId, areaId, 
        gameId, name, price, pics: JSON.stringify(pics) ?? undefined, level: GoodsLevelEnum.COMMON, status: GoodsSaleStatusEnum.PENDING_LISTING, no, seller_id: seller.id}).execute()
      return "发布成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async update() {
    
  }
  
  async viewOne(id: UUIDVersion) {
    // try {
      const tools = new Tools()
      const goods = await this.goodsRepository.findOne({where: {id}})
      if (tools.isNull(goods)) {
        return new NotFoundException("未找到该商品")
      }
      const seller = await this.userService.getUserInfo(undefined, goods?.seller_id)
      // await 
      const saleAttr = this.extractAttr('sale_attr_', goods?.sale_attr as unknown as Record<string, string>[])
      const goodsAttr = this.extractAttr('goods_attr_', goods?.goods_attr as unknown as Record<string, string>[])
    // }
    // catch (err) {
    //   return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    // }
  }
  
  private extractAttr(str, attr: Record<string, string>[]) {
    const obj: Record<string, string> = {}
    for (let index = 0; index < attr.length; index++) {
      const element = attr[index];
      Object.entries(element).map(([_, value]) => {
        // 属性id
        const key = _.replace(`${str}`, '')
        obj[key] = value;
      })
    }
  }
}