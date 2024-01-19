import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { GoodsEntity } from './goods.entity';
import { GameListEntity } from '../gameList/gameList.entity';
import { Permission } from '../permission/permission.entity';
import { UserModule } from '../user/user.module';
import { GoodsAttrEntity } from '../gameList/goodsAttr/goodsAttr.entity';
import { SaleAttrEntity } from '../gameList/saleAttr/saleAttr.entity';
import { ChannelEntity } from '../gameList/channel/channel.entity';
import { OrderModule } from '../order/order.module';
import { OrderEntity } from '../order/order.entity';
import { OrderService } from '../order/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      GoodsEntity,
      GameListEntity,
      GoodsAttrEntity,
      SaleAttrEntity,
      ChannelEntity,
      OrderEntity,
    ]),
    UserModule,
  ],
  controllers: [GoodsController],
  providers: [GoodsService, OrderService],
})
export class GoodsModule {}
