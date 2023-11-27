import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GameListAddDto } from './dto/gameList_add.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameListEntity } from './gameList.entity';
import { Like, Repository } from 'typeorm';
import { GameListDto } from './dto/gameList.dto';
import { UUIDVersion } from 'class-validator';
import { Tools } from 'src/common/tools/tools';
import { GameListLookDto } from './dto/gameList_look.dto';
import { GameListFilterDto } from './dto/gameList_filter.dto';
import { RedisJSON, RedisService } from '../redis/redis.service';

@Injectable()
export class GameListService {
  constructor(
    @InjectRepository(GameListEntity)
    private gameListEntity: Repository<GameListEntity>,
    private redisService: RedisService,
  ) {}

  private gameList = new GameListEntity();

  async add(gameListAddDto: GameListAddDto) {
    try {
      const { name, icon, status, type, sort, label } = gameListAddDto;
      return await this.gameListEntity
        .createQueryBuilder('gameList')
        .insert()
        .into(GameListEntity)
        .values({
          name,
          icon,
          status,
          type,
          sort,
          label: JSON.stringify(label),
        })
        .execute();
    } catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async update(gameListUpdateDto: GameListDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('gameList');

      const { id, name, icon, sort, status, type, label } = gameListUpdateDto;
      const gameItem = await this.gameListEntity.findOne({ where: { id } });
      if (new Tools().isNull(gameItem))
        return new HttpException('没有该游戏', HttpStatus.BAD_REQUEST);
      const { affected } = await this.gameListEntity.update(id, {
        name,
        icon,
        sort,
        status,
        type,
        label: JSON.stringify(label),
      });
      if (affected === 0)
        return new HttpException('更新失败', HttpStatus.FAILED_DEPENDENCY);
      else return '更新成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: UUIDVersion) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('gameList');
      const gameItem = await this.gameListEntity.findOne({ where: { id } });
      if (new Tools().isNull(gameItem))
        return new HttpException('没有该游戏', HttpStatus.BAD_REQUEST);
      let { affected } = await this.gameListEntity.delete(id);
      if (affected === 0)
        return new HttpException('删除失败', HttpStatus.FAILED_DEPENDENCY);
      else return '删除成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async query(gameListLookDto: GameListLookDto) {
    try {
      const { currentPage, pageSize, search, gameId, status } = gameListLookDto;
      const value = await this.redisService.getJSON('gameList');
      if (new Tools().isNull(value)) return value;
      const result = await this.gameListEntity
        .createQueryBuilder('gameList')
        .where('gameList.name LIKE :search', { search: `%${search ?? ''}%` })
        .andWhere('gameList.status like :status', {
          status: `%${status ?? ''}%`,
        })
        .andWhere('gameList.id like :id', { id: `%${gameId ?? ''}%` })
        .skip(pageSize * (currentPage - 1))
        .take(pageSize)
        .getMany();
      await this.redisService.setJSON(
        'gameList',
        result as unknown as RedisJSON,
      );
      return result;
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  /**
   *
   * @param gameListFilterDto 游戏id
   * @returns 游戏id对应的渠道及商品属性及销售属性
   */
  async filterItems(gameListFilterDto: GameListFilterDto) {
    try {
      const { gameId } = gameListFilterDto || {};
      const channel = await this.gameListEntity
        .createQueryBuilder('gameList')
        .relation(GameListEntity, 'channel')
        .of(gameId)
        .loadMany();
      const goodsAttr = await this.gameListEntity
        .createQueryBuilder('gameList')
        .relation(GameListEntity, 'GoodsAttr')
        .of(gameId)
        .loadMany();
      const saleAttr = await this.gameListEntity
        .createQueryBuilder('gameList')
        .relation(GameListEntity, 'saleAttr')
        .of(gameId)
        .loadMany();
      return {
        channel,
        goodsAttr,
        saleAttr,
      };
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
