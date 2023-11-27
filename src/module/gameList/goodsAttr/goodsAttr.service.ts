import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsAttrEntity } from './goodsAttr.entity';
import { Like, Repository } from 'typeorm';
import { GoodsAttrAddDto } from './dto/goodsAttrAdd.dto';
import { GameListEntity } from '../gameList.entity';
import { Tools } from 'src/common/tools/tools';
import { GoodsAttrViewDto } from './dto/goodsAttrView.dto';
import { GoodsAttrDeleteDto } from './dto/goodsAttrDelete.dto';
import { UUIDVersion } from 'class-validator';
import { GoodsAttrUpdateDto } from './dto/goodsAttrUpdate.dto';
import { RedisJSON, RedisService } from 'src/module/redis/redis.service';

@Injectable()
export class GoodsAttrService {
  private tools: Tools;
  constructor(
    @InjectRepository(GoodsAttrEntity)
    private goodsAttrRepository: Repository<GoodsAttrEntity>,
    @InjectRepository(GameListEntity)
    private gameListRepository: Repository<GameListEntity>,
    private redisService: RedisService,
  ) {
    this.tools = new Tools();
  }

  async add(goodsAttrAddDto: GoodsAttrAddDto) {
    try {
      const {
        name,
        value,
        secondaryAttr,
        minPrice,
        maxPrice,
        sort,
        isRequired,
        type,
        gameId,
      } = goodsAttrAddDto || {};
      const foundGame = await this.gameListRepository.findOne({
        where: { id: gameId },
      });
      if (new Tools().isNull(foundGame))
        return new NotFoundException('未找到该游戏');
      await this.goodsAttrRepository
        .createQueryBuilder('goodsAttr')
        .insert()
        .into(GoodsAttrEntity)
        .values({
          name,
          value: JSON.stringify(value) ?? '',
          secondaryAttr: JSON.stringify(secondaryAttr) ?? '',
          minPrice,
          maxPrice,
          sort,
          isRequired,
          type,
          gameList: foundGame!,
        })
        .execute();
      return '添加成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async view(goodsAttrViewDto: GoodsAttrViewDto) {
    try {
      const {
        gameId = '',
        gameName = '',
        GoodsAttrName = '',
        pageSize,
        current,
      } = goodsAttrViewDto || {};
      const value = await this.redisService.getJSON('goodsAttr');
      if (new Tools().isNull(value)) return value;
      const query = this.gameListRepository
        .createQueryBuilder('gameList')
        .leftJoinAndSelect('gameList.GoodsAttr', 'goodsAttr')
        .where('gameList.name like :name', { name: `%${gameName ?? ''}%` })
        .andWhere('goodsAttr.name like :attrName', {
          attrName: `%${GoodsAttrName ?? ''}%`,
        })
        .andWhere(gameId ? { id: gameId } : {})
        .skip((current - 1) * pageSize)
        .take(pageSize);
      if (!new Tools().isNull(gameId)) {
        return await query
          .relation(GameListEntity, 'GoodsAttr')
          .of(gameId)
          .loadMany();
      } else {
        const list = await query.getMany();
        const temp: GoodsAttrEntity[][] = [];
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          temp.push(element.GoodsAttr);
        }
        await this.redisService.setJSON(
          'goodsAttr',
          temp as unknown as RedisJSON,
        );
        return temp;
      }
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async delete(goodsAttrDeleteDto: GoodsAttrDeleteDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('goodsAttr');
      const { id } = goodsAttrDeleteDto || {};
      const foundGoodsAttr = await this.goodsAttrRepository.findOne({
        where: { id: id },
      });
      if (new Tools().isNull(foundGoodsAttr))
        return new NotFoundException('未找到该属性');
      await this.goodsAttrRepository.delete(id);
      return '删除成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async update(goodsAttrUpdateDto: GoodsAttrUpdateDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('goodsAttr');
      const {
        type,
        name,
        minPrice,
        maxPrice,
        sort,
        isRequired,
        gameId,
        value,
        id,
      } = goodsAttrUpdateDto || {};
      if (!new Tools().isNull(gameId)) {
        await this.goodsAttrRepository.query(
          `update goods_attr set gameListId = '${gameId}' where goods_attr.id = '${id}'`,
        );
      }
      await this.goodsAttrRepository
        .createQueryBuilder('goodsAttr')
        .update({
          type,
          name,
          minPrice,
          maxPrice,
          sort,
          isRequired,
          value: JSON.stringify(value) ?? '',
        })
        .where('goods_attr.id = :id', { id })
        .execute();
      return '更新成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
