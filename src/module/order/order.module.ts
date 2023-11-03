import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, OrderEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
