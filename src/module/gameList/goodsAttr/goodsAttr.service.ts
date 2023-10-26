import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsAttrEntity } from './goodsAttr.entity';
import { Like, Repository } from 'typeorm';
import { GoodsAttrAddDto } from './dto/goodsAttrAdd.dto';
import { GameListEntity } from '../gameList.entity';
import { Tools } from 'src/common/tools/tools';
import { GoodsAttrViewDto } from './dto/goodsAttrView.dto';
import { GoodsAttrDeleteDto } from './dto/goodsAttrDelete.dto';
import { UUIDVersion } from 'class-validator';

@Injectable()
export class GoodsAttrService {
  constructor(
    @InjectRepository(GoodsAttrEntity) private goodsAttrRepository: Repository<GoodsAttrEntity>,
    @InjectRepository(GameListEntity) private gameListRepository: Repository<GameListEntity>
    ) {}
  
  async add(goodsAttrAddDto: GoodsAttrAddDto) {
    try {
      const {name, value, secondaryAttr, minPrice, maxPrice, sort, isRequired, type, gameId} = goodsAttrAddDto || {}
      const foundGame = await this.gameListRepository.findOne({where: {id: gameId}})
      if (new Tools().isNull(foundGame)) return new NotFoundException("未找到该游戏")
      await this.goodsAttrRepository.createQueryBuilder("goodsAttr")
      .insert().into(GoodsAttrEntity)
      .values({name, value: value ?? "", secondaryAttr: JSON.stringify(secondaryAttr) ?? "", minPrice, maxPrice, sort, isRequired, type, gameList: foundGame!}).execute()
      return "添加成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async view(goodsAttrViewDto: GoodsAttrViewDto) {
    try {
      const {gameId = '', gameName = '', GoodsAttrName = '', pageSize, current} = goodsAttrViewDto || {}
      const query = this.gameListRepository.createQueryBuilder("gameList").leftJoinAndSelect("gameList.GoodsAttr", "goodsAttr")
        .where("gameList.name like :name", {name: `%${gameName ?? ''}%`}) 
        .andWhere("goodsAttr.name like :attrName", {attrName: `%${GoodsAttrName ?? ''}%`})
        .andWhere(gameId ? {id: gameId} : {})
        .skip((current - 1) * pageSize).take(pageSize)
      if (!new Tools().isNull(gameId)) {
        return await query.relation(GameListEntity, "GoodsAttr").of(gameId).loadMany()
      }
      else {
        const list = await query.getMany()
        const temp: GoodsAttrEntity[][] = []
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          temp.push(element.GoodsAttr)
        }
        return temp;
      }
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async delete(goodsAttrDeleteDto: GoodsAttrDeleteDto) {
    try {
      const {id} = goodsAttrDeleteDto || {}
      const foundGoodsAttr = await this.goodsAttrRepository.findOne({where: {id: id}})
      if (new Tools().isNull(foundGoodsAttr)) return new NotFoundException("未找到该属性")
      await this.goodsAttrRepository.delete(id)
      return "删除成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
}
