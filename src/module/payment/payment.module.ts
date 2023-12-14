import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserPaymentEntity } from './payment.entity';
import { HttpModule } from '@nestjs/axios';
import { Role } from '../role/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPaymentEntity, Role]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
