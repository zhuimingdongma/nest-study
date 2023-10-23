import { InjectRepository } from "@nestjs/typeorm";
import { ChannelEntity } from "./channel.entity";
import { Repository } from "typeorm";
import { ChannelAddDto } from './dto/channel_add.dto';
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { GameListEntity } from "../gameList.entity";
import { Tools } from "src/common/tools/tools";
import { ChannelViewDto } from './dto/channel_view.dto';

export class ChannelService {
  constructor(
   @InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
   @InjectRepository(GameListEntity) private gameListRepository: Repository<GameListEntity>) {}
  
  async add(channelAddDto: ChannelAddDto) {
    try {
      const {name, system, sort, gameId} = channelAddDto || {}
      const foundGame = await this.gameListRepository.findOne({where: {id:gameId}})
      if (new Tools().isNull(foundGame)) return new NotFoundException("未找到该游戏")
      // await this.channelRepository.createQueryBuilder("channel").insert().into(ChannelEntity).values({name: JSON.stringify(name), system, sort: sort ?? 0, gameList: foundGame!}).execute()
      const repository = await this.channelRepository.create({name, system, sort})
      repository.gameList = foundGame!
      return await this.channelRepository.save(repository)
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async view(channelViewDto: ChannelViewDto) {
    try {
      const {name, gameId, system} = channelViewDto || {}
      const foundGame = await this.gameListRepository.findOne({where: {id: gameId}})
      if (new Tools().isNull(foundGame)) return new NotFoundException('未找到该游戏')
      return await this.gameListRepository.createQueryBuilder("gameList").leftJoinAndSelect("gameList.channel", "channel")
      .where("channel.name like :name", {name: `%${name ?? ''}%`}).andWhere("channel.system like :system", {system: `%${system ?? ''}%`}).getMany()
      // .relation(GameListEntity, "channel").of(gameId).loadMany()
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
}