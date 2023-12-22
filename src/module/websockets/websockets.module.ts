import { Module } from '@nestjs/common';
import { VideoControllerModule } from '../videoController/videoController.module';
import { SocketGateway } from './websockets.gateway';
import { LogModule } from '../log/log.module';

@Module({
  imports: [LogModule, VideoControllerModule],
  providers: [SocketGateway],
})
export class WebSocketsModule {}
