import { Injectable } from "@nestjs/common/decorators/core";
import { NestMiddleware } from "@nestjs/common/interfaces";
import {Request, Response, NextFunction} from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request....')
    next()
  }
}