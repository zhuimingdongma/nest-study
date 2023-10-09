import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleAttrEntity } from './saleAttr.entity';
import { Repository } from 'typeorm';
import { SaleAttrAddDto } from './dto/saleAttr_add.dto';
import { GameListEntity } from '../gameList.entity';
import { UUIDVersion } from 'class-validator';
import { Tools } from 'src/common/tools/tools';

@Injectable()
export class SaleAttrService {
  constructor(
   @InjectRepository(SaleAttrEntity) private saleAttrRepository: Repository<SaleAttrEntity>,
   @InjectRepository(GameListEntity) private gameListRepository: Repository<GameListEntity>) {}
  
  async add(saleAttrAddDto: SaleAttrAddDto) {
    try {
      const {gameId, name, type, saleAttrType, value, minPrice, maxPrice, sort, required} = saleAttrAddDto || {}
      const saleAttr = this.saleAttrRepository.create()
      saleAttr.name = name;
      saleAttr.type = type;
      saleAttr.saleAttrType = saleAttrType
      saleAttr.value = value
      saleAttr.minPrice = minPrice
      saleAttr.maxPrice = maxPrice
      saleAttr.sort = sort
      saleAttr.isRequired = required 
      const gameList = await this.gameListRepository.findOne({where: {id: gameId}})
      if (gameList) saleAttr.gameList = gameList
      else return new NotFoundException('没有该游戏')
      return await this.saleAttrRepository.save(saleAttr)
    } 
    catch (err) {
      return new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
  }
  
  async delete(ids: UUIDVersion | UUIDVersion[]) {
    try {
      if (new Tools().isNull(ids)) return new NotFoundException('id不能为空')
      if (Array.isArray(ids)) {
        let list: SaleAttrEntity[] = []
        for (let index = 0; index < ids.length; index++) {
          const element = ids[index];
          const item = await this.saleAttrRepository.find({where: {id: element}})
          if (item.length !== 0) {
            list.push(item[0])
          }
          else {
            return new NotFoundException(`未找到该出售属性${element}`)
          }
        }
        return await this.saleAttrRepository.remove(list)
      }
      else {
        const saleAttrItem = await this.saleAttrRepository.find({where: {id: ids}})
        if (saleAttrItem.length !== 0) {
          return await this.saleAttrRepository.remove(saleAttrItem)
        }
        else {
          return new NotFoundException(`未找到该出售属性${ids}`)
        }
      }
    }
    catch(err) {
      return new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
  }
}