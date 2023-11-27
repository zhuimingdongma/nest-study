import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { OrderAddDto } from './dto/order_add.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderViewDto } from './dto/order_view.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  public async add(orderAddDto: OrderAddDto) {
    try {
      const {
        name,
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
          name,
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
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  public async view(orderViewDto: OrderViewDto) {
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
      sell_num,
      sell_id,
      status,
      createdTime,
      updateTime,
      statusCreatedTime,
      statusUpdateTime,
    } = orderViewDto || {};
    await this.orderRepository
      .createQueryBuilder('order')
      .where('id like :orderId', { orderId: `%${orderId ?? ''}%` })
      .andWhere('no like :orderNo', { orderNo: `%${orderNo ?? ''}%` })
      .andWhere('goodsNo like :goodsNo', { goodsNo: `%${goodsNo ?? ''}%` })
      .andWhere('name like :goodsName', { goodsName: `%${goodsName ?? ''}%` })
      .andWhere('');
  }
}
