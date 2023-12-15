import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CollectAddDto } from './dto/collect_add.dto';
import { UserRequest } from 'src/common/types/global';
import { Tools } from 'src/common/tools/tools';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectEntity } from './collect.entity';
import { Connection, Repository, getConnection } from 'typeorm';
import { LogService } from 'src/module/log/log.service';
import { CollectViewDto } from './dto/collect_view.dto';
import { CollectDelDto } from './dto/collect_del.dto';

@Injectable()
export class CollectService {
  private tools = new Tools();
  constructor(
    @InjectRepository(CollectEntity)
    private collectRepository: Repository<CollectEntity>,
    private logService: LogService,
  ) {}

  public async add(collectAddDto: CollectAddDto, req: UserRequest) {
    try {
      const { goodsId } = collectAddDto;
      const {
        user: { sub, username },
      } = req;
      const foundCollect = await this.collectRepository.findOne({
        where: { goodsId },
      });
      if (!this.tools.isNull(foundCollect))
        throw new HttpException('该商品已存在', HttpStatus.BAD_REQUEST);
      const result = await this.collectRepository
        .createQueryBuilder('collect')
        .insert()
        .into(CollectEntity)
        .values({
          goodsId,
        })
        .execute();
      if (this.tools.isNull(result))
        throw new HttpException(
          '添加收藏失败',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      await this.collectRepository
        .createQueryBuilder('collect')
        .relation(CollectEntity, 'user')
        .of(result.identifiers[0].id)
        .set(sub);
      this.logService.info(`${username} 添加收藏成功 商品为${goodsId}`);
      return '添加成功';
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async view(collectViewDto: CollectViewDto, req: UserRequest) {
    try {
      const { currentPage, pageSize } = collectViewDto;
      const {
        user: { sub },
      } = req;
      const result = await this.collectRepository
        .createQueryBuilder('collect')
        .leftJoin('collect.user', 'user')
        .where('user.id = :userId', { userId: sub })
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getMany();
      return result || [];
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async delete(collectDelDto: CollectDelDto, req: UserRequest) {
    try {
      const { id } = collectDelDto;
      const {
        user: { sub },
      } = req;
      if (id && Array.isArray(id) && id.length !== 0) {
        const { affected } = await this.collectRepository
          .createQueryBuilder('collect')
          .leftJoin('collect.user', 'user')
          .delete()
          .where('id IN (:...ids)', { ids: id })
          .andWhere('user.id = :userId', { userId: sub })
          .execute();
        if (affected === 0)
          throw new HttpException(
            '删除失败,不存在该id',
            HttpStatus.BAD_REQUEST,
          );
        return '删除成功';
      }
      return '删除失败';
    } catch (err) {
      this.tools.throwError(err);
    }
  }
}
