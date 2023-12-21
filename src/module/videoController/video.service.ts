import { cwd } from 'process';
import { LogService } from '../log/log.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassThrough, Readable } from 'stream';
import { Tools } from 'src/common/tools/tools';
import { VideoDecodeEnum } from 'src/common/enum/public.enum';

export type SplitVideoType = {
  videoDecodeType: VideoDecodeEnum;
  filePath: string;
  output?: string;
  fileName: string;
  duration: number;
  publicPath?: string;
};

export type SplitVideoStreamType = {
  videoDecodeType: VideoDecodeEnum;
  inputPath: string;
  keyInfo: string;
};

const fs = require('fs');
@Injectable()
export class SplitVideoService {
  private ffmpeg = require('fluent-ffmpeg');
  private ffmpegPath = require('@ffmpeg-installer/ffmpeg');
  private join = require('path').join;
  private resolve = require('path').resolve;
  private crypto = require('crypto');
  private fs = require('fs');

  constructor(
    private logService: LogService,
    private configService: ConfigService,
  ) {
    this.ffmpeg.setFfmpegPath(this.ffmpegPath.path);
  }

  public generateEncryptionKey() {
    return this.crypto.randomBytes(16).toString('hex');
  }

  public generateHLSKeyFile(key: string, output = './hls.key') {
    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }

    fs.writeFileSync(output, key, 'utf-8');
  }

  /**
   *
   * @param url 解密所需文件的http路径
   * @param localPath 加密所需文件的本地路径
   * @param output 加密完成后的本地路径
   * @param iv
   */
  public generateEncryptionKeyFile(
    url: string,
    localPath: string,
    output = this.join(process.cwd(), '/src/statics/video/encrypt/key_info'),
    iv: string = this.configService.get('ENCRYPT_DEFAULT_IV') || 'encryption',
  ) {
    const keyFile = this.join(
      process.cwd(),
      '/src/statics/video/encrypt/hls.key',
    );

    const encryptKey = fs.readFileSync(keyFile);

    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }

    const keyInfo = `${url}\n${localPath}\n${encryptKey}`;

    fs.writeFileSync(output, keyInfo, 'utf-8');
  }

  /**
   *
   * @param filePath 切片文件路径
   * @param output 输出文件目录
   * @param fileName 输出文件名
   * @param duration 每个切片间的时间间隔
   * @param publicPath 文件存储公共路径
   */
  public splitVideoFragment(splitVideoProps: SplitVideoType) {
    let {
      filePath,
      output,
      duration,
      publicPath,
      fileName,
      videoDecodeType = VideoDecodeEnum.H264,
    } = splitVideoProps;
    const publicFilePath = publicPath ?? this.join(cwd(), 'src/statics/video');
    filePath = publicPath
      ? `${publicPath}/${filePath}`
      : `${publicFilePath}/${filePath}`;
    output = publicPath ? publicPath : publicFilePath;

    return new Promise((resolve, reject) => {
      try {
        // 生成加密key
        const key = this.generateEncryptionKey();
        // 生成存储key的文件
        const outputKeyFile = this.join(
          process.cwd(),
          '/src/statics/video/encrypt/hls.key',
        );

        this.generateHLSKeyFile(key, outputKeyFile);
        // 生成hlsKey文件
        const outputKeyInfoFile = this.join(
          process.cwd(),
          'src',
          'statics',
          'video',
          'encrypt',
          'keyinfo',
        );

        this.generateEncryptionKeyFile(
          'http://localhost:5000/video/encrypt/hls.key',
          outputKeyFile,
          outputKeyInfoFile,
        );

        this.ffmpeg()
          .input(this.resolve(this.join(filePath)))
          .videoBitrate('1024k')
          .audioBitrate('128k')
          .addOption('-hls_time', '50')
          // 使用H.264编码器
          .addOption('-c:v', videoDecodeType)
          // 指定视频比特率为多少
          .addOption('-b:v', '10M')
          // 指定aac音频编码器
          .addOption('-c:a', 'aac')
          // 输出格式为hls
          .addOption('-f', 'hls')
          .addOption('-hls_key_info_file', outputKeyInfoFile)
          .outputOptions([
            '-hls_list_size 0',
            '-start_number 0',
            '-hls_segment_filename',
          ])
          .output(`${this.join(output!)}/${fileName}_%02d.ts`)
          .output(`${this.join(output!)}/${fileName}.m3u8`)
          .on('start', () => {
            console.log('文件切片开始');
            this.logService.info(
              `${this.join(filePath, fileName)}文件切片开始`,
            );
          })
          .on('error', (err) => {
            console.error(err);
            this.logService.error(
              `${this.join(filePath, fileName)}文件切片失败 ${err}`,
            );
            reject({
              err,
              fileName,
            });
          })
          .on('end', () => {
            this.logService.info(
              `${this.join(filePath, fileName)}文件切片完成`,
            );
            resolve({
              fileName,
            });
          })
          .run();
      } catch (err) {
        console.error('err: ', err);
        this.logService.error(
          `${this.join(filePath, fileName)}文件切片失败 ${err}`,
        );
        reject(err);
      }
    });
  }

  /**
   *
   * @param inputPath 输入路径
   * @param keyInfo keyInfo所在路径
   */
  public splitVideoToStream(props: SplitVideoStreamType): Promise<Readable> {
    return new Promise((resolve, reject) => {
      try {
        const {
          inputPath,
          keyInfo,
          videoDecodeType = VideoDecodeEnum.H264,
        } = props;
        const readableStream = new Readable({
          read() {},
        });

        const passThrough = new PassThrough();

        const command = this.ffmpeg(inputPath)
          // 分割时间间隔
          .addOption('-hls_time', '50')
          // 使用H.264编码器
          .addOption('-c:v', videoDecodeType)
          // 指定视频比特率为多少
          .addOption('-b:v', '10M')
          // 指定aac音频编码器
          .addOption('-c:a', 'aac')
          // 输出格式为hls
          .addOption('-f', 'hls')
          // 生成.m3u8文件
          .addOption('-hls_list_size', '0')
          .addOption('-hls_key_info_file', keyInfo)
          .pipe(passThrough, { end: true });

        command.on('stderr', (info) => {
          this.logService.info(info);
          console.log(info);
        });

        passThrough
          .on('data', (chunk) => {
            // this.logService.info(`Receive chunk of size:${chunk.length}`);
            readableStream.push(chunk);
          })
          .on('end', () => {
            this.logService.info(`流处理完成`);
            readableStream.push(null);
          })
          .on('error', (err) => {
            new Tools().throwError(err);
            readableStream.destroy(err);
          });
        resolve(readableStream);
      } catch (err) {
        new Tools().throwError(err);
        reject(err);
      }
    });
  }
}
