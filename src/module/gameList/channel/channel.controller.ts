import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { ChannelAddDto } from './dto/channel_add.dto';
import { ChannelService } from './channel.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ChannelViewDto } from './dto/channel_view.dto';
import { ChannelDelDto } from './dto/channel_del.dto';
import { ChannelUpdateDto } from './dto/channelUpdateDto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('/game/channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('/add')
  @ApiBearerAuth()
  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBody({ type: [ChannelAddDto] })
  async add(@Body() channelAddDto: ChannelAddDto) {
    return await this.channelService.add(channelAddDto);
  }

  @Get('/view')
  @Public()
  @ApiQuery({ type: [ChannelViewDto] })
  async view(@Query() channelViewDto: ChannelViewDto) {
    return await this.channelService.view(channelViewDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Delete('del')
  @ApiBearerAuth()
  @ApiQuery({ type: [ChannelDelDto] })
  async del(@Query() channelDelDto: ChannelDelDto) {
    return await this.channelService.delete(channelDelDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Post('/update')
  @ApiBearerAuth()
  @ApiBody({ type: [ChannelUpdateDto] })
  async update(@Body() channelUpdateDto: ChannelUpdateDto) {
    return await this.channelService.update(channelUpdateDto);
  }
}
