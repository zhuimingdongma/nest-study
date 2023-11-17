import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cwd } from 'process';
import { Tools } from '../../common/tools/tools';
import { MergeDto, VerifyDto } from './dto/merge.dto';
export class UploadService {
  private Tools = new Tools();
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
      if (!this.Tools.isNull(hash) && !this.Tools.isNull(filename)) {
        console.log(file.size);
        const CHUNK_DIR = this.path.resolve(this.UPLOAD_DIR, 'chunk', filename);
        if (!this.fsExtra.existsSync(CHUNK_DIR)) {
          // 创建临时文件夹
          await this.fsExtra.mkdirs(CHUNK_DIR);
        }

        const fileHash = `${CHUNK_DIR}/${hash}`;
        // 创建文件
        await this.fsExtra.createFile(fileHash, (err) => {
          return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
        });
        // 写入文件
        if (!this.fsExtra.existsSync(fileHash)) {
          await this.fsExtra.outputFile(
            `${CHUNK_DIR}/${hash}`,
            file.buffer,
            (err) => {
              return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
            },
          );
        }
      }
      // const uuid = randomUUID();
      // const fs = require('fs');
      // const suffix = file.originalname.split('.')[1];

      // await fs.writeFile(
      //   `${cwd()}/src/common/upload/${uuid}.${suffix}`,
      //   '',
      //   (err) => {
      //     return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
      //   },
      // );
      // await fs.writeFileSync(
      //   `${cwd()}/src/common/upload/${uuid}.${suffix}`,
      //   file.buffer,
      // );
      // return `${cwd()}/src/common/upload/${uuid}.${suffix}`;
    } catch (err) {
      console.log('err: ', err);
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  public async merge(mergeDto: MergeDto) {
    try {
      const { fileName, size } = await this.resolvePost(mergeDto);
      const filePath = this.path.resolve(this.UPLOAD_DIR, fileName);
      return await this.mergeFileStream(filePath, size, fileName);
    } catch (err) {
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }

  public async verify(verifyDto: VerifyDto) {
    const { fileHash, fileName } = verifyDto;
    if (this.fsExtra.existsSync(this.path.resolve(this.UPLOAD_DIR, fileName))) {
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
    await this.fsExtra.rmdirSync(chunkDir);
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
