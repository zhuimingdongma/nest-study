import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { VideoTestDto } from './dto/video_test.dto';
import { SplitVideoService } from './video.service';
import { VideoDecodeEnum } from 'src/common/enum/public.enum';

const path = require('path');
@Controller('/video')
export class VideoController {
  constructor(private SplitVideoService: SplitVideoService) {}
  @Public()
  @Get('/test')
  // @ApiQuery({ type: VideoTestDto })
  async test(@Query() VideoTestDto: VideoTestDto) {
    // const { path } = VideoTestDto;
    const inputPath = path.join(process.cwd(), '/src/statics/video/video.mp4');
    const keyInfo = path.join(
      process.cwd(),
      '/src/statics/video/encrypt/keyinfo',
    );
    return await this.SplitVideoService.splitVideoToStream({
      inputPath,
      keyInfo,
      videoDecodeType: VideoDecodeEnum.NVIDIA,
    });
    // return await this.SplitVideoService.splitVideoFragment({
    //   filePath: path,
    //   fileName: 'dongma',
    //   duration: 100,
    //   videoDecodeType: VideoDecodeEnum.NVIDIA,
    // });
  }
}
