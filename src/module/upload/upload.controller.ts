import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { File } from 'buffer';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { MergeDto, VerifyDto } from './dto/merge.dto';

@Controller('/upload')
export class UploadController {
  private uploadService: UploadService = new UploadService();

  @Public()
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }),
          new FileTypeValidator({
            fileType: /.(png|jpeg|jpg|sheet|pdf|text|mp4|txt|octet-stream)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadDto,
  ) {
    const { filename, hash } = uploadDto;
    return await this.uploadService.upload(file, hash, filename);
  }

  @Public()
  @Post('/merge')
  async merge(@Body() mergeDto: MergeDto) {
    return await this.uploadService.merge(mergeDto);
  }

  @Public()
  @Post('/verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return await this.uploadService.verify(verifyDto);
  }
}
