import { InjectRepository } from '@nestjs/typeorm';
import { AreaEntity } from './area.entity';
import { Repository } from 'typeorm';
import { AreaAddDto } from './dto/areaAddDto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChannelEntity } from '../channel/channel.entity';
import { Tools } from 'src/common/tools/tools';
import { AreaViewDto } from './dto/areaViewDto';
import { AreaDelDto } from './dto/areaDelDto';
import { AreaUpdateDto } from './dto/areaUpdateDto';
import { ExcelOperation } from 'src/common/tools/excel_operation';
import { RedisJSON, RedisService, ZMember } from '../../redis/redis.service';
import { LogService } from 'src/module/log/log.service';
import { GameListEntity } from '../gameList.entity';

@Injectable()
export class AreaService {
  private tools = new Tools();
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    private redisService: RedisService,
    private logService: LogService,
  ) {}

  async generateExcel() {
    try {
      new ExcelOperation().generateExcelData();
      this.logService.info('创建excel成功');
      return '创建excel成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async add(areaAddDto: AreaAddDto) {
    try {
      const { name, sort, id, file } = areaAddDto || {};
      const foundChannel = await this.channelRepository.findOne({
        where: { id },
      });
      if (new Tools().isNull(foundChannel))
        throw new NotFoundException('未找到该区服');

      const sheets = await new ExcelOperation().read();
      for (const key in sheets) {
        if (Object.prototype.hasOwnProperty.call(sheets, key)) {
          const value = sheets[key];
          for (let index = 0; index < value.length; index++) {
            const element = value[index];
            const repository = await this.areaRepository.create({
              name: JSON.stringify(element.name),
              sort: sort ?? 0,
              channel: foundChannel!,
            });
            await this.areaRepository.save(repository);
          }
        }
      }
      this.logService.info('执行excel插入area成功');
      return '插入excel成功';

      // const list = name.split(' ');
      // if (Array.isArray(list) && list.length !== 0) {
      //   for (let index = 0; index < list.length; index++) {
      //     const element = list[index];
      //   }
      // }
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async view(areaViewDto: AreaViewDto) {
    try {
      const {
        areaId,
        channelId,
        gameId,
        areaName,
        channelName,
        gameName,
        current,
        pageSize,
      } = areaViewDto || {};
      // const value = await this.redisService.getJSON('area');
      // if (!new Tools().isNull(value)) return value;
      // const value = await this.redisService.lRange('paging', (current - 1) * pageSize, ((current) * pageSize))
      // if (!new Tools().isNull(value)) {
      //   const tempList: any[] = []
      //   for (let index = 0; index < value.length; index++) {
      //     const element = JSON.parse(value[index]);
      //     tempList.push(element)
      //   }
      //   return tempList;
      // };
      // await this.redisService.hSet('hash')
      // const hashKeyList = await this.areaRepository.find({
      //   skip: (current - 1) * pageSize,
      //   take: pageSize,
      // });
      // for (let index = 0; index < hashKeyList.length; index++) {
      //   const hashKey = hashKeyList[index];
      //   await this.redisService.hSet(
      //     'hashKey',
      //     hashKey.name,
      //     JSON.stringify(hashKey),
      //   );
      // }
      // const { tuples } =
      //   (await this.redisService.hScan('hashKey', `*${areaName}*`)) || {};
      // const value = await this.redisService.zRange(
      //   'paging',
      //   (current - 1) * pageSize,
      //   current * pageSize,
      // );
      // if (!new Tools().isNull(value)) {
      //   const tempList: any[] = [];
      //   for (let index = 0; index < value.length; index++) {
      //     const element = JSON.parse(value[index]);
      //     tempList.push(element);
      //   }
      //   return tempList;
      // }
      // return await this.areaRepository
      //   .createQueryBuilder('area')
      //   .leftJoin('area.channel', 'channel')
      //   .skip((current - 1) * pageSize)
      //   .take(pageSize)
      //   .getMany();
      const query = await this.areaRepository
        .createQueryBuilder('area')
        .useIndex('name')
        .useIndex('areaSort')
        .useIndex('areaId')
        .useIndex('channel')
        .useIndex('channelName')
        .useIndex('channelId')
        .useIndex('gameListId')
        .useIndex('gameListName')
        .leftJoinAndMapMany(
          'area.channel',
          ChannelEntity,
          'channel',
          'channel.id = area.channelId',
        )
        .leftJoinAndMapMany(
          'channel.gameList',
          GameListEntity,
          'gameList',
          'gameList.id = channel.gameListId',
        );
      if (!this.tools.isNull(areaId)) {
        query.andWhere('area.id = :areaId', { areaId });
      }

      if (!this.tools.isNull(channelId)) {
        query.andWhere('channel.id = :channelId', { channelId });
      }

      if (!this.tools.isNull(areaName)) {
        query.andWhere('area.name like :name', {
          name: `%${areaName ?? ''}%`,
        });
      }
      if (!this.tools.isNull(gameId)) {
        query.andWhere('gameList.id = :gameId', { gameId });
      }
      if (!this.tools.isNull(channelName)) {
        query.andWhere('channel.name like :channelName', {
          channelName: `%${channelName ?? ''}%`,
        });
      }
      if (!this.tools.isNull(gameName)) {
        query.andWhere('gameList.name like :gameName', {
          gameName: `%${gameName ?? ''}%`,
        });
      }
      query.skip((current - 1) * pageSize).take(pageSize);

      const result = await query.getMany();
      const total = await query.getCount();

      // const tempList: ZMember[] = [];
      // for (let index = 0; index < result.length; index++) {
      //   const element = result[index];
      //   tempList.push({ score: index, value: JSON.stringify(element) });
      //   // await this.redisService.rPush('paging', JSON.stringify(element))
      // }

      // await this.redisService.ZADD('paging', tempList);
      // await this.redisService.setJSON('area', result as unknown as RedisJSON);
      return { result, total };
    } catch (err) {
      this.tools.throwError(err);
    }
  }
  async delete(areaDelDto: AreaDelDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('area');
      const { areaId, channelId } = areaDelDto || {};
      if (!new Tools().isNull(channelId)) {
        const { affected } = await this.areaRepository
          .createQueryBuilder()
          .delete()
          .from(AreaEntity)
          .where('channelId = :id', { id: channelId })
          .execute();
        if (affected === 1) {
          this.logService.info(`${areaId} 删除成功`);
          return '删除成功';
        } else
          throw new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const { affected } = await this.areaRepository.delete({ id: areaId });
      if (affected === 1) {
        this.logService.info(`${areaId} 删除成功`);
        return '删除成功';
      } else
        throw new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async update(areaUpdateDto: AreaUpdateDto) {
    try {
      // await this.redisService.deleteOrUpdateRedisJSON('area');
      await this.redisService.expire('paging', 1);
      const tools = new Tools();
      const { areaId, channelId, name, sort } = areaUpdateDto || {};
      if (!tools.isNull(channelId)) {
        await this.areaRepository
          .createQueryBuilder('area')
          .leftJoinAndSelect('area.channel', 'channel')
          .relation('area', 'channel')
          .of(areaId)
          .set(channelId);
      }
      const { affected } = await this.areaRepository
        .createQueryBuilder('area')
        .leftJoinAndSelect('area.channel', 'channel')
        .update({ name, sort })
        .where('area.id = :areaId', { areaId: areaId })
        .execute();
      if (affected === 1) {
        this.logService.info(`${areaId} 更新成功`);
        return '更新成功';
      } else
        throw new HttpException('更新失败', HttpStatus.UNPROCESSABLE_ENTITY);
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
