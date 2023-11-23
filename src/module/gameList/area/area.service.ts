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
import { RedisJSON, RedisService } from '../../redis/redis.service';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    private redisService: RedisService, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateExcel() {
    try {
      new ExcelOperation().generateExcelData();
      return '创建excel成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async add(areaAddDto: AreaAddDto) {
    try {
      const { name, sort, id, file } = areaAddDto || {};
      const foundChannel = await this.channelRepository.findOne({
        where: { id },
      });
      if (new Tools().isNull(foundChannel))
        return new NotFoundException('未找到该区服');

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
      return '插入excel成功';

      // const list = name.split(' ');
      // if (Array.isArray(list) && list.length !== 0) {
      //   for (let index = 0; index < list.length; index++) {
      //     const element = list[index];
      //   }
      // }
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
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
      const value = await this.redisService.getJSON('area', 5);
      if (!new Tools().isNull(value)) return value;
      const result = await this.areaRepository
        .createQueryBuilder('area')
        .leftJoinAndSelect('area.channel', 'channel')
        .leftJoinAndSelect('channel.gameList', 'gameList')
        .where('area.id like :areaId', { areaId: `%${areaId ?? ''}%` })
        .andWhere('channel.id like :channelId', {
          channelId: `%${channelId ?? ''}`,
        })
        .andWhere('gameList.id like :gameId', { gameId: `%${gameId ?? ''}%` })
        .andWhere('area.name like :name', { name: `%${areaName ?? ''}%` })
        .andWhere('channel.name like :channelName', {
          channelName: `%${channelName ?? ''}%`,
        })
        .andWhere('gameList.name like :gameName', {
          gameName: `%${gameName ?? ''}%`,
        })
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getMany();
      await this.redisService.setJSON('area', result as unknown as RedisJSON);
      return result;
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async delete(areaDelDto: AreaDelDto) {
    try {
      const { areaId, channelId } = areaDelDto || {};
      if (!new Tools().isNull(channelId)) {
        const { affected } = await this.areaRepository
          .createQueryBuilder()
          .delete()
          .from(AreaEntity)
          .where('channelId = :id', { id: channelId })
          .execute();
        if (affected === 1) return '删除成功';
        else return new HttpException('删除失败', HttpStatus.FAILED_DEPENDENCY);
      }
      const { affected } = await this.areaRepository.delete({ id: areaId });
      if (affected === 1) return '删除成功';
      else return new HttpException('删除失败', HttpStatus.FAILED_DEPENDENCY);
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async update(areaUpdateDto: AreaUpdateDto) {
    try {
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
      if (affected === 1) return '更新成功';
      else return new HttpException('更新失败', HttpStatus.FAILED_DEPENDENCY);
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
