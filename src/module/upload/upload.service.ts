import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cwd } from 'process';
export class UploadService {
  public async upload(file: Express.Multer.File) {
    try {
      console.log('file: ', file);
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
      return new HttpException(err, HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
