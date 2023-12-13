import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as amqp from 'amqplib';
import { LogLevel } from 'src/common/enum/public.enum';

@Injectable()
export class LogService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject('RabbitMQChannel') private channel: amqp.Channel,
  ) {}

  info(message: string) {
    this.publishToRabbitMQ(message, LogLevel.INFO);
  }

  error(message: string, trace?: string) {
    this.publishToRabbitMQ(message, LogLevel.ERROR, trace);
  }

  warn(message: string) {
    this.publishToRabbitMQ(message, LogLevel.WARN);
  }

  debug(message: string) {
    this.publishToRabbitMQ(message, LogLevel.DEBUG);
  }

  private async publishToRabbitMQ(
    message: string,
    level: LogLevel = LogLevel.INFO,
    trace?: string,
  ) {
    this.channel.sendToQueue(
      'logs',
      Buffer.from(JSON.stringify({ message, level, trace })),
    );
    // await this.channel.close();
  }
}
