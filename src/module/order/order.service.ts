import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { OrderAddDto } from './dto/order_add.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
      await this.orderRepository
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
}
