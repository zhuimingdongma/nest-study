import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from './channel.entity';
import { Repository } from 'typeorm';
import { ChannelAddDto } from './dto/channel_add.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { GameListEntity } from '../gameList.entity';
import { Tools } from 'src/common/tools/tools';
import { ChannelViewDto } from './dto/channel_view.dto';
import { ChannelDelDto } from './dto/channel_del.dto';
import { ChannelUpdateDto } from './dto/channelUpdateDto';
import { AllowNull } from 'src/common/types/global';

export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @InjectRepository(GameListEntity)
    private gameListRepository: Repository<GameListEntity>,
  ) {}

  async add(channelAddDto: ChannelAddDto) {
    try {
      const { name, system, sort, gameId } = channelAddDto || {};
      const foundGame = await this.gameListRepository.findOne({where: {id:gameId}})
      if (new Tools().isNull(foundGame)) return new NotFoundException("未找到该游戏")
      // await this.channelRepository.createQueryBuilder("channel").insert().into(ChannelEntity).values({name: JSON.stringify(name), system, sort: sort ?? 0, gameList: foundGame!}).execute()
      const repository = await this.channelRepository.create({name, system, sort})
      repository.gameList = foundGame!
      return await this.channelRepository.save(repository)
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async view(channelViewDto: ChannelViewDto) {
    try {
      const { name, gameId, system, current, pageSize } = channelViewDto || {};
      const foundGame = await this.gameListRepository.findOne({
        where: { id: gameId },
      });
      if (new Tools().isNull(foundGame))
        return new NotFoundException('未找到该游戏');
      return await this.gameListRepository
        .createQueryBuilder('gameList')
        .leftJoinAndSelect('gameList.channel', 'channel')
        .where('channel.name like :name', { name: `%${name ?? ''}%` })
        .andWhere('channel.system like :system', {
          system: `%${system ?? ''}%`,
        })
        .andWhere('gameList.id = :gameId', { gameId })
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getMany();
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async delete(channelDelDto: ChannelDelDto) {
    try {
      const { channelId } = channelDelDto || {};
      const { affected } = await this.channelRepository.delete({
        id: channelId,
      });
      if (affected === 0)
        return new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
      else return '删除成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async update(channelUpdateDto: ChannelUpdateDto) {
    try {
      const { id, name, system, sort, gameId } = channelUpdateDto || {};
      let foundGame: AllowNull<GameListEntity>;
      const repository = new ChannelEntity();
      repository.name = name;
      repository.system = system;
      repository.sort = sort;
      repository.id = id;
      if (gameId) {
        foundGame = await this.gameListRepository.findOne({
          where: { id: gameId },
        });
        if (new Tools().isNull(foundGame))
          return new NotFoundException('未找到该游戏');
        repository.gameList = foundGame!;
      }
      const { affected } = await this.channelRepository.update(id, repository);
      if (affected === 1) return '更新成功';
      else
        return new HttpException('更新失败', HttpStatus.UNPROCESSABLE_ENTITY);
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
