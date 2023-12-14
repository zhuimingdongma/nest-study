import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from './channel.entity';
import { Repository } from 'typeorm';
import { ChannelAddDto } from './dto/channel_add.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameListEntity } from '../gameList.entity';
import { Tools } from 'src/common/tools/tools';
import { ChannelViewDto } from './dto/channel_view.dto';
import { ChannelDelDto } from './dto/channel_del.dto';
import { ChannelUpdateDto } from './dto/channelUpdateDto';
import { AllowNull } from 'src/common/types/global';
import { RedisJSON, RedisService } from '../../redis/redis.service';
import { LogService } from '../../log/log.service';

@Injectable()
export class ChannelService {
  private tools = new Tools();
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @InjectRepository(GameListEntity)
    private gameListRepository: Repository<GameListEntity>,
    private redisService: RedisService,
    private logService: LogService,
  ) {}

  async add(channelAddDto: ChannelAddDto) {
    try {
      const { name, system, sort, gameId } = channelAddDto || {};
      const foundGame = await this.gameListRepository.findOne({
        where: { id: gameId },
      });
      if (new Tools().isNull(foundGame))
        throw new NotFoundException('未找到该游戏');
      // await this.channelRepository.createQueryBuilder("channel").insert().into(ChannelEntity).values({name: JSON.stringify(name), system, sort: sort ?? 0, gameList: foundGame!}).execute()
      const repository = await this.channelRepository.create({
        name,
        system,
        sort,
      });
      repository.gameList = foundGame!;
      const result = await this.channelRepository.save(repository);
      this.logService.info('保存成功');
      return result;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async view(channelViewDto: ChannelViewDto) {
    try {
      const { name, gameId, system, current, pageSize } = channelViewDto || {};
      const foundGame = await this.gameListRepository.findOne({
        where: { id: gameId },
      });
      if (new Tools().isNull(foundGame))
        throw new NotFoundException('未找到该游戏');
      const value = await this.redisService.getJSON('channel');
      if (new Tools().isNull(value)) return value;
      const result = await this.gameListRepository
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
      await this.redisService.setJSON(
        'channel',
        result as unknown as RedisJSON,
      );
      return result;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async delete(channelDelDto: ChannelDelDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('channel');
      const { channelId } = channelDelDto || {};
      const { affected } = await this.channelRepository.delete({
        id: channelId,
      });
      if (affected === 0)
        throw new HttpException('删除失败', HttpStatus.UNPROCESSABLE_ENTITY);
      else return '删除成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  async update(channelUpdateDto: ChannelUpdateDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('channel');
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
          throw new NotFoundException('未找到该游戏');
        repository.gameList = foundGame!;
      }
      const { affected } = await this.channelRepository.update(id, repository);
      if (affected === 1) return '更新成功';
      else throw new HttpException('更新失败', HttpStatus.UNPROCESSABLE_ENTITY);
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
