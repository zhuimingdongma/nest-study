import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleAttrEntity } from './saleAttr.entity';
import { Repository } from 'typeorm';
import { SaleAttrAddDto } from './dto/saleAttr_add.dto';
import { GameListEntity } from '../gameList.entity';
import { UUIDVersion } from 'class-validator';
import { Tools } from 'src/common/tools/tools';
import { SaleAttrUpdateDto } from './dto/saleAttr_update.dto';

@Injectable()
export class SaleAttrService {
  constructor(
   @InjectRepository(SaleAttrEntity) private saleAttrRepository: Repository<SaleAttrEntity>,
   @InjectRepository(GameListEntity) private gameListRepository: Repository<GameListEntity>) {}
   
  async add(saleAttrAddDto: SaleAttrAddDto) {
    try {
      const {gameId, name, type, saleAttrType, value, minPrice, maxPrice, sort, required} = saleAttrAddDto || {}
      const gameList = await this.gameListRepository.findOne({where: {id: gameId}})
      if(!gameList) return new NotFoundException('没有该游戏')
      const saleAttr = this.saleAttrRepository.create({name, type, saleAttrType, value, minPrice, maxPrice, sort, isRequired: required})
      if (gameList) saleAttr.gameList = gameList
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
  
  async update(saleAttrUpdateDto: SaleAttrUpdateDto) {
    try {
      const {id, saleAttrType, type, name, value, minPrice, maxPrice, sort, required} = saleAttrUpdateDto;
      const saleAttrVal = this.saleAttrRepository.create({id, saleAttrType, type, name, value, maxPrice, minPrice, sort, isRequired: required})
      return await this.saleAttrRepository.save(saleAttrVal)
    }
    catch (err) {
      return new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
  }
    
  async view(gameId?: UUIDVersion, name?: string) {
    try {
      const tools = new Tools()
      if (tools.isNull(gameId)) return await this.saleAttrRepository.createQueryBuilder('saleAttr').where('saleAttr.name LIKE :search', {search: `%${name}%`}).getMany()
      const gameList = await this.gameListRepository.findOne({where:{id: gameId}, relations: ['saleAttr'] });
      if (tools.isNull(gameList)) return new NotFoundException('未找到该游戏')
      if (name) return gameList?.saleAttr.filter(saleAttr => saleAttr.name.includes(name))
      else return gameList?.saleAttr
    }
    catch(err) {
      return new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    }
  }
}
