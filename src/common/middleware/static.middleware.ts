import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { join, resolve } from 'path';
import { cwd } from 'process';
import * as express from 'express';

@Injectable()
export class StaticMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const staticPath = resolve(join(cwd(), 'src/public'));
    const filePath = join(staticPath, '/video');

    express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
    express.static(filePath, { index: false, extensions: ['m3u8'] })(
      req,
      res,
      next,
    );
  }
}
