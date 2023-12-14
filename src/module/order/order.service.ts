import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { OrderAddDto } from './dto/order_add.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderViewDto } from './dto/order_view.dto';
import { Tools } from 'src/common/tools/tools';
import { User } from '../user/user.entity';
import { OrderUpdateDto } from './dto/order_update.dto';
import { LogService } from '../log/log.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private logService: LogService,
  ) {}
  private tools = new Tools();

  public async add(orderAddDto: OrderAddDto) {
    try {
      const {
        price,
        gameId,
        channelId,
        areaId,
        goodsId,
        seller_id,
        buyer_id,
        goodsNo,
        no,
        pics,
        status,
        status_update_time,
        service_fee,
      } = orderAddDto || {};
      return await this.orderRepository
        .createQueryBuilder('order')
        .insert()
        .into(OrderEntity)
        .values({
          price,
          gameId,
          channelId,
          areaId,
          goodsId,
          seller_id,
          buyer_id,
          goodsNo,
          no,
          pics: pics ?? undefined,
          status,
          status_update_time: status_update_time ?? null,
          service_fee,
        })
        .execute();
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async view(orderViewDto: OrderViewDto) {
    try {
      const {
        orderId,
        orderNo,
        goodsNo,
        goodsName,
        minPrice,
        maxPrice,
        goodsId,
        seller_id,
        seller_num,
        buyer_num,
        buyer_id,
        status,
        createdTime,
        updatedTime,
        statusCreatedTime,
        statusUpdatedTime,
      } = orderViewDto || {};
      const query = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.id like :orderId', { orderId: `%${orderId ?? ''}%` })
        .andWhere('order.no like :orderNo', { orderNo: `%${orderNo ?? ''}%` })
        .andWhere('order.goodsNo like :goodsNo', {
          goodsNo: `%${goodsNo ?? ''}%`,
        })
        .andWhere('order.goodsId like :goodsId', {
          goodsId: `%${goodsId ?? ''}%`,
        })
        .andWhere('order.seller_id like :seller_id', {
          seller_id: `%${seller_id ?? ''}%`,
        })
        .andWhere('order.buyer_id like :buyer_id', {
          buyer_id: `%${buyer_id ?? ''}%`,
        })
        .andWhere('order.status like :status', { status: `%${status ?? ''}%` });
      if (!this.tools.isNull(minPrice) && !this.tools.isNull(maxPrice)) {
        query.andWhere('order.price between :minPrice and :maxPrice', {
          minPrice,
          maxPrice,
        });
      }

      if (!this.tools.isNull(createdTime) && !this.tools.isNull(updatedTime)) {
        const start = new Date(createdTime).getTime() / 1000;
        const end = new Date(updatedTime).getTime() / 1000;
        query.andWhere(
          'UNIX_TIMESTAMP(order.createdTime) between :start and :end',
          { start, end },
        );
      }
      if (
        !this.tools.isNull(statusCreatedTime) &&
        !this.tools.isNull(statusUpdatedTime)
      ) {
        query.andWhere(
          'UNIX_TIMESTAMP(order.status_update_time) between :statusCreatedTime and : statusUpdateTime',
          { statusCreatedTime, statusUpdatedTime },
        );
      }

      if (!this.tools.isNull(buyer_num)) {
        const buyers = await this.userRepository
          .createQueryBuilder('user')
          .where('user.phone like :buyer_num', {
            buyer_num: `%${buyer_num ?? ''}%`,
          })
          .getMany();

        if (!this.tools.isNull(buyers)) {
          for (let index = 0; index < buyers.length; index++) {
            const buyer = buyers[index];
            await query.andWhere('order.buyer_id like :buyer_id', {
              buyer_id: `%${buyer.id ?? ''}%`,
            });
          }
        }
      }

      if (!this.tools.isNull(seller_num)) {
        const sellers = await this.userRepository
          .createQueryBuilder('user')
          .where('user.phone like :seller_num', {
            seller_num: `%${seller_num ?? ''}%`,
          })
          .getMany();
        if (!this.tools.isNull(sellers)) {
          for (let index = 0; index < sellers.length; index++) {
            const seller = sellers[index];
            await query.andWhere('order.seller_id = :seller_id', {
              seller_id: seller.id,
            });
          }
        }
      }
      return await query.getMany();
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async update(orderUpdateDto: OrderUpdateDto) {
    try {
      const {} = orderUpdateDto || {};
    } catch (err) {}
  }
}
