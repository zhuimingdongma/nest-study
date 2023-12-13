import { Module } from '@nestjs/common';
import * as winston from 'winston';
import * as amqp from 'amqplib';
import { WinstonModule } from 'nest-winston';
import { LogService } from './log.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [
    LogService,
    {
      provide: 'RabbitMQConnection',
      useFactory: async () => {
        const connection = await amqp.connect('amqp://localhost:5672');
        return connection;
      },
    },
    {
      provide: 'RabbitMQChannel',
      useFactory: async (connection: amqp.Connection) => {
        const channel = await connection.createChannel();
        await channel.assertQueue('logs', { durable: true });
        return channel;
      },
      inject: ['RabbitMQConnection'],
    },
  ],
  exports: [LogService],
})
export class LogModule {}
