import { InjectRepository } from '@nestjs/typeorm';
import { GoodsEntity } from './goods.entity';
import { Repository } from 'typeorm';
import { GoodsAddDto } from './dto/goods_add.dto';
import { GameListEntity } from '../gameList/gameList.entity';
import {
  GoodsLevelEnum,
  GoodsSaleStatusEnum,
  OrderStatusEnum,
} from 'src/common/enum/public.enum';
import { SnowFlake } from 'src/common/tools/SnowFlak';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { UUIDVersion } from 'class-validator';
import { UserService } from '../user/user.service';
import { Tools } from 'src/common/tools/tools';
import { SaleAttrEntity } from '../gameList/saleAttr/saleAttr.entity';
import { GoodsAttrEntity } from '../gameList/goodsAttr/goodsAttr.entity';
// import Os from 'os'
import { GoodsUpdateDto } from './dto/goods_update.dto';
import { GoodsViewAllDto } from './dto/goods_view_all.dto';
import { ChannelEntity } from '../gameList/channel/channel.entity';
import { GoodsViewResponse } from 'src/common/types/goodsViewRes';
import { GoodsDetailsDto } from './dto/goods_details.dto';
import { OrderService } from '../order/order.service';
import { GoodsPaymentDto } from './dto/goods_payment.dto';
import { OrderAddDto } from '../order/dto/order_add.dto';
import { AllowNull } from 'src/common/types/global';
import {
  RedisCommandArgument,
  RedisJSON,
  RedisService,
  ZMember,
} from '../redis/redis.service';
import { OrderEntity } from '../order/order.entity';

@Injectable()
export class GoodsService {
  private tools: Tools;
  constructor(
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(GoodsAttrEntity)
    private goodsAttrRepository: Repository<GoodsAttrEntity>,
    @InjectRepository(SaleAttrEntity)
    private saleAttrRepository: Repository<SaleAttrEntity>,
    @InjectRepository(GameListEntity)
    private gameListRepository: Repository<GameListEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private userService: UserService,
    private orderService: OrderService,
    private redisService: RedisService,
  ) {
    this.tools = new Tools();
  }

  async add(goodsAddDto: GoodsAddDto, id: UUIDVersion) {
    try {
      const {
        sale_attr,
        goods_attr,
        channelId,
        areaId,
        gameId,
        name,
        price,
        pics,
      } = goodsAddDto || {};
      const no = new SnowFlake(
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ).nextId();
      const seller = (await this.userService.getUserInfo(
        undefined,
        id,
      )) as User;
      await this.goodsRepository
        .createQueryBuilder('goods')
        .insert()
        .into(GoodsEntity)
        .values({
          sale_attr: JSON.stringify(sale_attr),
          goods_attr: JSON.stringify(goods_attr),
          channelId,
          areaId,
          gameId,
          name,
          price,
          pics: pics ?? undefined,
          level: GoodsLevelEnum.COMMON,
          status: GoodsSaleStatusEnum.PENDING_LISTING,
          no,
          seller_id: seller.id,
        })
        .execute();
      return '发布成功';
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async update(goodsUpdateDto: GoodsUpdateDto) {
    try {
      await this.redisService.deleteOrUpdateRedisJSON('goods');
      const { saleAttr, goodsAttr, pics, level, status, label, areaId, id } =
        goodsUpdateDto || {};

      const result = await this.goodsRepository
        .createQueryBuilder('goods')
        .update({
          sale_attr: saleAttr ?? undefined,
          goods_attr: goodsAttr ?? undefined,
          pics: pics ?? undefined,
          level: level ?? 'common',
          status: status ?? 0,
          label: label ?? undefined,
          areaId: areaId ?? undefined,
        })
        .where('goods.id = :id', { id })
        .execute();
      // 上架
      if (result && status === 1) {
        const { affected } = await this.goodsRepository
          .createQueryBuilder('goods')
          .update({ shelf_time: new Date().toISOString() })
          .where('goods.id = :id', { id })
          .execute();
        if (affected === 0)
          return new HttpException(
            '更新上架时间失败',
            HttpStatus.FAILED_DEPENDENCY,
          );
      }
      return result;
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async getAll(goodsViewAllDto: GoodsViewAllDto) {
    try {
      const {
        currentPage,
        pageSize,
        no,
        name,
        status,
        seller_id,
        phone,
        gameName,
        channelName,
        level,
        startedTime,
        endTime,
        minPrice,
        maxPrice,
      } = goodsViewAllDto || {};
      // const value = await this.redisService.getJSON('goods');
      // if (!new Tools().isNull(value)) return value;
      let game_name: string = '';
      let phone_number: string = '';
      const query = await this.goodsRepository
        .createQueryBuilder('goods')
        .where('goods.no like :no', { no: `%${no ?? ''}%` })
        .andWhere('goods.name like :name', { name: `%${name ?? ''}%` })
        .andWhere('goods.status like :status', { status: `%${status ?? ''}%` })
        .andWhere('goods.seller_id like :seller_id', {
          seller_id: `%${seller_id ?? ''}%`,
        })
        .andWhere('goods.level like :level', { level: `%${level ?? ''}%` });

      if (!this.tools.isNull(startedTime) && !this.tools.isNull(endTime)) {
        const started = new Date(startedTime).getTime() / 1000;
        const end = new Date(endTime).getTime() / 1000;
        query.andWhere(
          'UNIX_TIMESTAMP(goods.createdTime) between :started and :end',
          { started, end },
        );
      }

      if (!this.tools.isNull(minPrice) && !this.tools.isNull(maxPrice)) {
        query.andWhere('goods.price between :minPrice and :maxPrice', {
          minPrice,
          maxPrice,
        });
      }

      // channelName参数  ~~~~~~~~~
      if (!this.tools.isNull(channelName)) {
        const channel = await this.channelRepository
          .createQueryBuilder('channel')
          .where('channel.name like :channelName', {
            channelName: `%${channelName ?? ''}%`,
          })
          .getMany();
        if (!this.tools.isNull(channel)) {
          for (let index = 0; index < channel.length; index++) {
            const element = channel[index];
            query.andWhere('goods.channelId = :channelId', {
              channelId: element.id,
            });
          }
        }
      }

      if (!this.tools.isNull(phone)) {
        const user = await this.userRepository
          .createQueryBuilder('user')
          .where('user.phone = :phone', { phone })
          .getOne();
        if (!this.tools.isNull(user)) {
          phone_number = user?.phone!;
          query.andWhere('goods.seller_id = :userId', { userId: user?.id });
        }
      }

      // gameName参数 需从游戏表中查出游戏id 再从商品表查游戏id
      if (!this.tools.isNull(gameName)) {
        const game = await this.gameListRepository
          .createQueryBuilder('game')
          .where('game.name like :gameName', {
            gameName: `%${gameName ?? ''}%`,
          })
          .getMany();
        if (!this.tools.isNull(game)) {
          for (let index = 0; index < game.length; index++) {
            const element = game[index];
            game_name = element.name;
            query.andWhere('goods.gameId = :gameId', { gameId: element.id });
          }
        }
      }

      const list = await query
        .orderBy('goods.sort', 'DESC')
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getMany();
      const scoreList: ZMember[] = [];
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        scoreList.push({
          score: element.price,
          value: JSON.stringify(element),
        });
      }

      await this.redisService.ZADD('goodsAll1', scoreList);
      let rangeList = await this.redisService.zRange('goodsAll1', 0, 100000);

      rangeList = rangeList.map((range) => JSON.parse(range));
      let result: GoodsViewResponse[] = [
        ...(rangeList as unknown as GoodsViewResponse[]),
      ];

      result.forEach((res) => {
        res.game_name = game_name;
        res.phone_number = phone_number;
      });

      await this.redisService.setJSON(
        'goods',
        result as unknown as RedisJSON,
        2,
      );
      return [...result];
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async viewOne(id: UUIDVersion) {
    try {
      const tools = new Tools();
      const count = await this.redisService.increment(`${id}`);
      // if (!tools.isNull(count)) {
      //   if (count > 100)
      //     return new HttpException('已超出限制', HttpStatus.FAILED_DEPENDENCY);
      //   else {
      //     await this.redisService.expire(`${id}`, 1000);
      //     return count;
      //   }
      // }
      const goodsInfo = await this.redisService.getJSON('goodsInfo');
      if (!tools.isNull(goodsInfo)) return goodsInfo;
      const goods = await this.goodsRepository.findOne({ where: { id } });
      if (tools.isNull(goods)) {
        return new NotFoundException('未找到该商品');
      }
      const { gameId, channelId, areaId, goods_attr, sale_attr, ...remain } =
        goods!;
      const seller = await this.userService.getUserInfo(
        undefined,
        goods?.seller_id,
      );
      const goodsAttr = await this.goodsAttrRepository.query(
        `select * from goods_attr where gameListId = '${goods?.gameId}'`,
      );

      const saleAttr = await this.saleAttrRepository.query(
        `select * from sale_attr where gameListId = '${goods?.gameId}'`,
      );
      // const area = await this.saleAttrRepository.query(
      //   `select * from area where area.channelId = '${goods?.channelId}'`,
      // );
      const selectedChannel = await this.goodsAttrRepository.query(
        `select channel.name, channel.system, area.name as areaName from channel join area on area.channelId = channel.id where channel.id = '${goods?.channelId}' and area.id = '${goods?.areaId}'`,
      );

      // const attr1 = await this.goodsAttrRepository.createQueryBuilder('goodsAttr').leftJoinAndSelect("goodsAttr.gameList", "gameList").where("gameList.id = :gameListId", {gameListId: goods?.gameId}).getMany()
      const selectedSaleAttr = await this.extractAttr(
        'sale_attr_',
        goods?.sale_attr as unknown as Record<string, string>[],
      );
      const selectedGoodsAttr = await this.extractAttr(
        'goods_attr_',
        goods?.goods_attr as unknown as Record<string, string>[],
      );

      const obj = {
        // area,
        goodsInfo: remain,
        selectedChannel,
        saleAttr,
        goodsAttr,
        selectedSaleAttr,
        selectedGoodsAttr,
        seller,
        count,
      };

      await this.redisService.setJSON('goodsInfo', JSON.stringify(obj));

      return obj;
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  async generateOrderAndSell(
    goodsPaymentDto: GoodsPaymentDto,
    userId: UUIDVersion,
  ) {
    try {
      const { goodsId } = goodsPaymentDto || {};
      let orderObj = await this.orderRepository.create();
      const goods = await this.goodsRepository.findOne({
        where: { id: goodsId },
      });
      if (this.tools.isNull(goods))
        return new NotFoundException('未找到该商品,请稍后重试');
      // 获取用户
      const user = (await this.userService.getUserInfo(
        undefined,
        userId,
      )) as User;
      if (this.tools.isNull(user))
        return new NotFoundException('未找到该用户,请稍后重试');
      const { no, id, gameId, channelId, areaId, seller_id, pics, price } =
        goods!;
      orderObj!.goodsNo = no;
      orderObj!.no = new SnowFlake(
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ).nextId();
      orderObj!.goodsId = id;
      orderObj!.gameId = gameId;
      orderObj!.channelId = channelId;
      orderObj!.areaId = areaId;
      orderObj!.seller_id = seller_id;
      orderObj!.pics = pics;
      orderObj!.status = OrderStatusEnum.BE_PAID;
      orderObj!.price = price;
      orderObj!.service_fee = price * 0.05;
      orderObj!.buyer_id = user.id;
      const { affected } = await this.goodsRepository
        .createQueryBuilder('goods')
        .update(GoodsEntity)
        .set({ status: 2 })
        .where('id = :goodsId', { goodsId })
        .execute();
      if (affected !== 1)
        return new HttpException(
          '商品状态更新失败',
          HttpStatus.FAILED_DEPENDENCY,
        );
      return await this.orderService.add(orderObj!);
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  public async extractAttr(str, attr: Record<string, string>[]) {
    const obj: Record<string, string> = {};
    const repository =
      str === 'sale_attr_' ? this.saleAttrRepository : this.goodsAttrRepository;
    for (let index = 0; index < attr.length; index++) {
      const element = attr[index];
      for (const key in element) {
        const value = element[key];
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          const id = key.replace(`${str}`, '') as UUIDVersion;
          const attr = await repository.findOne({ where: { id } });
          if (new Tools().isNull(attr)) {
            throw new HttpException(
              '发布时上传的属性id不正确',
              HttpStatus.NOT_FOUND,
            );
          }
          obj[attr!.name] = value;
        }
      }
    }
    return obj;
  }
}
