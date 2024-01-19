import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SplitVideoService } from '../videoController/video.service';
import { VideoDecodeEnum } from 'src/common/enum/public.enum';
import { LogService } from '../log/log.service';
import { Socket } from 'dgram';
import { Inject } from '@nestjs/common';

@WebSocketGateway(80, { namespace: 'videoStream', transports: ['websocket'] })
export class SocketGateway {
  private path = require('path');
  constructor(private logService: LogService) {}
  private splitVideoService = new SplitVideoService(this.logService);

  @SubscribeMessage('stream')
  async handleEvent(
    @MessageBody('path') path: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logService.info(`接收到${path}资源请求`);
    const inputPath = this.path.join(
      process.cwd(),
      `/src/statics/video/${path}`,
    );
    const keyInfo = this.path.join(
      process.cwd(),
      '/src/statics/video/encrypt/keyinfo',
    );

    const timer = setInterval(async () => {
      const stream = await this.splitVideoService.splitVideoToStream({
        inputPath,
        keyInfo,
        videoDecodeType: VideoDecodeEnum.NVIDIA,
      });
      if (stream !== true) {
        socket.emit('events', stream);
      }
      else clearInterval(timer)
      // else socket.disconnect();
    }, 50);

    socket.on('disconnect', () => {
      console.log('断开连接');
      clearInterval(timer);
    });
  }
}
