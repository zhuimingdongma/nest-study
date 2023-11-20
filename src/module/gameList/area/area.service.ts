import { InjectRepository } from '@nestjs/typeorm';
import { AreaEntity } from './area.entity';
import { Repository } from 'typeorm';
import { AreaAddDto } from './dto/areaAddDto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ChannelEntity } from '../channel/channel.entity';
import { Tools } from 'src/common/tools/tools';
import { AreaViewDto } from './dto/areaViewDto';
import { GameListEntity } from '../gameList.entity';
import { AreaDelDto } from './dto/areaDelDto';
import { AreaUpdateDto } from './dto/areaUpdateDto';
import { ExcelOperation } from 'src/common/tools/excel_operation';
// import fs from 'fs';

export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
  ) {}

  async add(areaAddDto: AreaAddDto) {
    try {
      const { name, sort, id, file } = areaAddDto || {};
      const foundChannel = await this.channelRepository.findOne({
        where: { id },
      });
      if (new Tools().isNull(foundChannel))
        return new NotFoundException('未找到该区服');
      const getRandomChineseWord = () => {
        let _rsl = '';
        let _randomUniCode = Math.floor(
          Math.random() * (40870 - 19968) + 19968,
        ).toString(16);
        eval('_rsl=' + '"\\u' + _randomUniCode + '"');
        return _rsl;
      };
      let str = '';
      for (let i = 0; i < 5; i++) {
        str += getRandomChineseWord();
      }
      const tempList = new Array(5000).fill({
        name: str,
      });
      await new ExcelOperation().generate(tempList);

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
      return await this.areaRepository
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
