import {Injectable, HttpException, HttpStatus} from '@nestjs/common'
import { GameListAddDto } from './dto/gameList_add.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameListEntity } from './gameList.entity';
import { Repository } from 'typeorm';
import { GameListDto } from './dto/gameList.dto';

@Injectable()
export class GameListService {
  constructor(@InjectRepository(GameListEntity) private gameListEntity: Repository<GameListEntity>) {}
  
  private gameList = new GameListEntity()
  
  async add(gameListAddDto: GameListAddDto) {
    try {
      // const gameList = new GameListEntity()
      for (const key in gameListAddDto) {
        if (Object.prototype.hasOwnProperty.call(gameListAddDto, key)) {
          const element = gameListAddDto[key];
          this.gameList[key] = element
        }
      }
      return await this.gameListEntity.save(this.gameList)
    }
    catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }
  
  async update(gameListUpdateDto: GameListDto) {
    try {
      const {id, name, icon} = gameListUpdateDto
      return await this.gameListEntity.update(id, {name, icon})
    }
    catch (err) {
      return new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }
}