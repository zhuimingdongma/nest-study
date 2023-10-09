import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, HttpException } from "@nestjs/common";
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => {
      return {
        msg: data instanceof HttpException ? "请求失败" : '请求成功',
        code: data instanceof HttpException ? data.getStatus() : HttpStatus.OK,
        data
      }
    }))
  }
}