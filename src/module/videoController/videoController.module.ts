import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { LogModule } from '../log/log.module';
import { SplitVideoService } from './video.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LogModule, ConfigModule],
  controllers: [VideoController],
  providers: [SplitVideoService],
})
export class VideoControllerModule {}
