import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [EmailController],
})
export class EmailModule {}
