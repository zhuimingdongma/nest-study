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
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('/game/area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBearerAuth()
  @Post('/add')
  @ApiBody({ type: [AreaAddDto] })
  async add(@Body() areaAddDto: AreaAddDto) {
    return await this.areaService.add(areaAddDto);
  }

  @Auth(AuthEnum.SUPER)
  @ApiBearerAuth()
  @Post('/generate')
  async generate() {
    return await this.areaService.generateExcel();
  }

  @Public()
  @Get('/view')
  @ApiQuery({ type: [AreaViewDto] })
  async view(@Query() areaViewDto: AreaViewDto) {
    console.log('areaViewDto: ', areaViewDto);
    return await this.areaService.view(areaViewDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBearerAuth()
  @Delete('/del')
  @ApiQuery({ type: [AreaDelDto] })
  async delete(@Query() areaDelDto: AreaDelDto) {
    return await this.areaService.delete(areaDelDto);
  }

  @Auth(AuthEnum.ADMIN, AuthEnum.SUPER)
  @ApiBearerAuth()
  @Post('/update')
  @ApiBody({ type: [AreaUpdateDto] })
  async update(@Body() areaUpdateDto: AreaUpdateDto) {
    return await this.areaService.update(areaUpdateDto);
  }
}
