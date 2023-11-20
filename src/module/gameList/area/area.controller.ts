import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthEnum } from 'src/common/enum/public.enum';
import { AreaAddDto } from './dto/areaAddDto';
import { Public } from 'src/common/decorator/public.decorator';
import { AreaViewDto } from './dto/areaViewDto';
import { AreaDelDto } from './dto/areaDelDto';
import { AreaUpdateDto } from './dto/areaUpdateDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/game/area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  // @UseInterceptors(
  //   FileInterceptor('<name of file here - file in your screenshot>'),
  // )
  // @UploadedFile()
  // file;
  @Post('/add')
  async add(@Body() areaAddDto: AreaAddDto) {
    return await this.areaService.add(areaAddDto);
  }

  @Public()
  @Get('/view')
  async view(@Query() areaViewDto: AreaViewDto) {
    return await this.areaService.view(areaViewDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Delete('/del')
  async delete(@Query() areaDelDto: AreaDelDto) {
    return await this.areaService.delete(areaDelDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @Post('/update')
  async update(@Body() areaUpdateDto: AreaUpdateDto) {
    return await this.areaService.update(areaUpdateDto);
  }
}
