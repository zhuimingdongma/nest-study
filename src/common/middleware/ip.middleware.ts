import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IPRequest } from '../types/global';

@Injectable()
export class IPMiddleware implements NestMiddleware {
  use(req: IPRequest, res: Response, next: (error?: any) => void) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (Array.isArray(ip) && ip.length !== 0 && ip) {
      req.clientIp = ip[ip.length - 1];
    } else {
      req.clientIp = ip as string;
    }
    next();
  }
}
