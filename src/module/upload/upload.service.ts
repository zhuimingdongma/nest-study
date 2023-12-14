import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cwd } from 'process';
import { Tools } from '../../common/tools/tools';
import { MergeDto, VerifyDto } from './dto/merge.dto';

@Injectable()
export class UploadService {
  private tools = new Tools();
  private path = require('path');
  private UPLOAD_DIR = this.path.resolve(cwd(), 'target');
  private fsExtra = require('fs-extra');

  public async upload(
    file: Express.Multer.File,
    hash?: string,
    filename?: string,
  ) {
    try {
      // 大文件上传
      if (!this.tools.isNull(hash) && !this.tools.isNull(filename)) {
        // 临时文件目录
        const CHUNK_DIR = this.path.resolve(this.UPLOAD_DIR, 'chunk', filename);
        if (!(await this.fsExtra.exists(CHUNK_DIR))) {
          // 创建临时文件夹
          await this.fsExtra.mkdirs(CHUNK_DIR);
        }

        // 临时文件
        const fileHash = `${CHUNK_DIR}/${hash}`;

        // 创建文件
        await this.fsExtra.createFile(fileHash, (err) => {
          throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
        });

        // 写入文件
        if (!(await this.fsExtra.exists(fileHash))) {
          await this.fsExtra.outputFile(
            `${CHUNK_DIR}/${hash}`,
            file.buffer,
            (err) => {
              throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
            },
          );
        }
        return '上传成功';
      }
      const uuid = randomUUID();
      const fs = require('fs');
      const suffix = file.originalname.split('.')[1];

      await fs.writeFile(
        `${cwd()}/src/common/upload/${uuid}.${suffix}`,
        file.buffer,
      );
      return `${cwd()}/src/common/upload/${uuid}.${suffix}`;
    } catch (err) {
      this.tools.throwError(err);
    }
  }

  public async merge(mergeDto: MergeDto) {
    try {
      const { fileName, size } = await this.resolvePost(mergeDto);
      const filePath = this.path.resolve(this.UPLOAD_DIR, fileName);
      return await this.mergeFileStream(filePath, size, fileName);
    } catch (err) {
      const {
        status = HttpStatus.INTERNAL_SERVER_ERROR,
        message = '服务器出错',
      } = err;
      throw new HttpException(err || message, status);
    }
  }

  public async verify(verifyDto: VerifyDto) {
    const { fileHash, fileName } = verifyDto;
    if (
      await this.fsExtra.exists(this.path.resolve(this.UPLOAD_DIR, fileName))
    ) {
      return { shouldUpload: false };
    } else return { shouldUpload: true };
  }

  public async resolvePost(
    mergeDto: MergeDto,
  ): Promise<{ fileName: string; size: number }> {
    return new Promise((resolve) => {
      const fileName = mergeDto.fileName;
      resolve({ fileName, size: mergeDto.size });
    });
  }

  private async mergeFileStream(
    filePath: string,
    size: number,
    fileName: string,
  ) {
    const chunkDir = this.path.resolve(this.UPLOAD_DIR, 'chunk', fileName);
    const files = await this.fsExtra.readdir(chunkDir);
    files.sort((a, b) => a.split('-')[1] - b.split('-')[1]);

    const writeStream = this.fsExtra.createWriteStream(filePath);

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      await this.pipeStream(
        this.path.resolve(this.UPLOAD_DIR, 'chunk', fileName, element),
        writeStream,
      );
      this.fsExtra.unlinkSync(
        this.path.resolve(this.UPLOAD_DIR, 'chunk', fileName, element),
      );
    }

    writeStream.close();
    this.fsExtra.rmdirSync(chunkDir);
    return this.path.resolve(this.UPLOAD_DIR, fileName);
  }

  private async pipeStream(filePath: string, stream): Promise<void> {
    return new Promise((resolve) => {
      const readStream = this.fsExtra.createReadStream(filePath);
      readStream.on('end', () => {
        resolve();
      });
      readStream.pipe(stream, { end: false });
    });
  }
}
