import {Injectable, HttpException, HttpStatus} from '@nestjs/common'
import { GameListAddDto } from './dto/gameList_add.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameListEntity } from './gameList.entity';
import { Like, Repository } from 'typeorm';
import { GameListDto } from './dto/gameList.dto';
import { UUIDVersion } from 'class-validator';
import { Tools } from 'src/common/tools/tools';
import { GameListLookDto } from './dto/gameList_look.dto';

@Injectable()
export class GameListService {
  constructor(@InjectRepository(GameListEntity) private gameListEntity: Repository<GameListEntity>) {}
  
  private gameList = new GameListEntity()
  
  async add(gameListAddDto: GameListAddDto) {
    try {
      const {name, icon, status, type, sort, label } = gameListAddDto
      return await this.gameListEntity.createQueryBuilder("gameList").insert().into(GameListEntity).values({name, icon, status, type, sort, label: JSON.stringify(label)}).execute();
    }
    catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }
  
  async update(gameListUpdateDto: GameListDto) {
    try {
      const {id, name, icon, sort, status, type, label} = gameListUpdateDto
      const gameItem = await this.gameListEntity.findOne({where: {id}})
      if (new Tools().isNull(gameItem)) return new HttpException("没有该游戏", HttpStatus.BAD_REQUEST)
      const {affected} = await this.gameListEntity.update(id, {name, icon, sort, status, type, label: JSON.stringify(label)})
      if (affected === 0) return new HttpException("更新失败", HttpStatus.FAILED_DEPENDENCY)
      else return "更新成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }
  
  async delete(id: UUIDVersion) {
    try {
      const gameItem = await this.gameListEntity.findOne({where: {id}})
      if (new Tools().isNull(gameItem)) return new HttpException("没有该游戏", HttpStatus.BAD_REQUEST)
      let {affected} = await this.gameListEntity.delete(id)
      if (affected === 0) return new HttpException("删除失败", HttpStatus.FAILED_DEPENDENCY)
      else return "删除成功"
    }
    catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY)
    }
  }
  
  async query(gameListLookDto: GameListLookDto) {
    const {currentPage, pageSize, search} = gameListLookDto
    if (new Tools().isNull(search)) {
      return await this.gameListEntity.createQueryBuilder("gameList").skip(pageSize * (currentPage - 1)).take(pageSize).getMany()
    }
    else {
      return await this.gameListEntity.createQueryBuilder('gameList').where("gameList.name LIKE :search", {search: `%${search}%`}).skip(pageSize * (currentPage - 1)).take(pageSize).getMany()
    }
  }
}