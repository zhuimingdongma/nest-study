import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CollectAddDto } from './dto/collect_add.dto';
import { CollectService } from './collect.service';
import { UserRequest } from 'src/common/types/global';
import { CollectViewDto } from './dto/collect_view.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { CollectDelDto } from './dto/collect_del.dto';

@ApiBearerAuth()
@Controller('/collect')
export class CollectController {
  constructor(private collectService: CollectService) {}

  @Post('/add')
  @ApiBody({ type: CollectAddDto })
  async add(@Body() collectAddDto: CollectAddDto, @Req() req: UserRequest) {
    return await this.collectService.add(collectAddDto, req);
  }

  @Get('/view')
  @ApiQuery({ type: CollectViewDto })
  async view(@Query() collectViewDto: CollectViewDto, @Req() req: UserRequest) {
    return await this.collectService.view(collectViewDto, req);
  }

  @Delete('/del')
  @ApiBody({ type: CollectDelDto })
  async del(@Body() collectDelDto: CollectDelDto, @Req() req: UserRequest) {
    return await this.collectService.delete(collectDelDto, req);
  }
}
