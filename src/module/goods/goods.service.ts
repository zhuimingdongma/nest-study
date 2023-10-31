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
import { SaleAttrEntity } from '../gameList/saleAttr/saleAttr.entity';
import { GoodsAttrEntity } from "../gameList/goodsAttr/goodsAttr.entity";
// import Os from 'os'
import { GoodsUpdateDto } from './dto/goods_update.dto';
import { GoodsViewAllDto } from "./dto/goods_view_all.dto";

export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity) private goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GoodsAttrEntity) private goodsAttrRepository: Repository<GoodsAttrEntity>,
    @InjectRepository(SaleAttrEntity) private saleAttrRepository: Repository<SaleAttrEntity>,
    private userService: UserService
  ) {}
  
  async add(goodsAddDto: GoodsAddDto, id: UUIDVersion) {
    try {
      const {sale_attr, goods_attr, channelId, areaId, gameId, name, price, pics} = goodsAddDto || {}
      const no = new SnowFlake(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)).nextId()
      const seller = await this.userService.getUserInfo(undefined, id) as User
      await this.goodsRepository.createQueryBuilder('goods').insert().into(GoodsEntity).values({sale_attr: JSON.stringify(sale_attr), goods_attr: JSON.stringify(goods_attr), channelId, areaId, 
        gameId, name, price, pics: pics ?? undefined, level: GoodsLevelEnum.COMMON, status: GoodsSaleStatusEnum.PENDING_LISTING, no, seller_id: seller.id}).execute()
      return "发布成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async update(goodsUpdateDto: GoodsUpdateDto) {
    try {
      const {saleAttr, goodsAttr, pics, level, status, label, areaId, id} = goodsUpdateDto || {}
      return await this.goodsRepository.createQueryBuilder('goods')
      .update({sale_attr: saleAttr ?? undefined, goods_attr: goodsAttr ?? undefined, pics: pics ?? undefined,
         level: level ?? 'common', status: status ?? 0, label : label ?? undefined, areaId: areaId ?? undefined})
      .where("goods.id = :id", {id}).execute()
    }
    catch(err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async getAll(goodsViewAllDto: GoodsViewAllDto) {
    try {
      const {currentPage, pageSize, no, name, status, seller_id, phone, gameName, channelName, startedTime, endTime} = goodsViewAllDto || {}
      return await this.goodsRepository.createQueryBuilder("goods")
      .where("goods.no like :no", {no: `%${no ?? ''}%`})
      .andWhere('goods.name like :name', {name: `%${name ?? ''}%`}).andWhere('goods.status like :status', {status: `%${status ?? ''}%`})
      .andWhere('goods.createdTime between :startedTime and :endTime', {startedTime, endTime})
      .skip((currentPage - 1) * pageSize).take(pageSize).getMany()
    }
    catch(err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async viewOne(id: UUIDVersion) {
    try {
      const tools = new Tools()
      const goods = await this.goodsRepository.findOne({where: {id}})
      if (tools.isNull(goods)) {
        return new NotFoundException("未找到该商品")
      }
      const {gameId, channelId, areaId, goods_attr, sale_attr, ...remain} = goods!;
      const seller = await this.userService.getUserInfo(undefined, goods?.seller_id)
      const goodsAttr = await this.goodsAttrRepository.query(`select * from goods_attr where gameListId = '${goods?.gameId}'`)
      const saleAttr = await this.saleAttrRepository.query(`select * from sale_attr where gameListId = '${goods?.gameId}'`)
      const area = await this.saleAttrRepository.query(`select * from area where area.channelId = '${goods?.channelId}'`)
      const selectedChannel = await this.goodsAttrRepository.query(`select channel.name, channel.system, area.name as areaName from channel join area on area.channelId = channel.id where channel.id = '${goods?.channelId}' and area.id = '${goods?.areaId}'`)
      
      // const attr1 = await this.goodsAttrRepository.createQueryBuilder('goodsAttr').leftJoinAndSelect("goodsAttr.gameList", "gameList").where("gameList.id = :gameListId", {gameListId: goods?.gameId}).getMany()
      const selectedSaleAttr = await this.extractAttr('sale_attr_', goods?.sale_attr as unknown as Record<string, string>[])
      const selectedGoodsAttr = await this.extractAttr('goods_attr_', goods?.goods_attr as unknown as Record<string, string>[])
      return {
        goodsInfo:remain, 
        area,
        selectedChannel,
        saleAttr,
        goodsAttr,
        selectedSaleAttr, 
        selectedGoodsAttr,
        seller
      }
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  private async extractAttr(str, attr: Record<string, string>[]) {
    const obj: Record<string, string> = {}
    const repository = str === 'sale_attr_' ? this.saleAttrRepository : this.goodsAttrRepository
    for (let index = 0; index < attr.length; index++) {
      const element = attr[index];
      for (const key in element) {
        const value = element[key]
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          const id = key.replace(`${str}`, '') as UUIDVersion
          const attr = await repository.findOne({where: {id}})
          if (new Tools().isNull(attr)) {
            throw new HttpException("发布时上传的属性id不正确", HttpStatus.NOT_FOUND)
          }
          obj[attr!.name] = value;
        }
      }
    }
    return obj;
  }
}