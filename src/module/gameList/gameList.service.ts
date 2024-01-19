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
import { LogService } from '../log/log.service';

@Injectable()
export class GameListService {
  private tools = new Tools();

  constructor(
    @InjectRepository(GameListEntity)
    private gameListEntity: Repository<GameListEntity>,
    private redisService: RedisService,
    private logService: LogService,
  ) {}

  private gameList = new GameListEntity();

  async add(gameListAddDto: GameListAddDto) {
    try {
      const { name, icon, status, type, sort, label } = gameListAddDto;
      const result = await this.gameListEntity
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
      this.logService.info(`添加游戏${name}成功`);
      return result;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async update(gameListUpdateDto: GameListDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('gameList');

      const { id, name, icon, sort, status, type, label } = gameListUpdateDto;
      const gameItem = await this.gameListEntity.findOne({ where: { id } });
      if (new Tools().isNull(gameItem))
        throw new HttpException('没有该游戏', HttpStatus.NOT_FOUND);
      const { affected } = await this.gameListEntity.update(id, {
        name,
        icon,
        sort,
        status,
        type,
        label: JSON.stringify(label),
      });
      if (affected === 0)
        throw new HttpException('更新失败', HttpStatus.UNPROCESSABLE_ENTITY);
      else return '更新成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async delete(id: UUIDVersion) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('gameList');
      const gameItem = await this.gameListEntity.findOne({ where: { id } });
      if (new Tools().isNull(gameItem))
        throw new HttpException('没有该游戏', HttpStatus.NOT_FOUND);
      let { affected } = await this.gameListEntity.delete(id);
      if (affected === 0)
        throw new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
      else return '删除成功';
    } catch (err) {
      this.tools.throwError(err);
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
      this.tools.throwError(err);
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
      this.tools.throwError(err);
    }
  }
}
