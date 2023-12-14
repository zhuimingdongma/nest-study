import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from '../user/user.module';
import { LogModule } from '../log/log.module';

@Module({
  imports: [UserModule, LogModule],
  controllers: [EmailController],
})
export class EmailModule {}
