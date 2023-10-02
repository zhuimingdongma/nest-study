import {Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'

type Response<T> = {
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(ctx: ExecutionContextHost, handler: CallHandler): Observable<Response<T>> {
    return handler.handle().pipe(map(data => ({data})))
  }
}