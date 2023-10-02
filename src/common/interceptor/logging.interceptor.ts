import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import {tap} from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, handler: CallHandler) {
    console.log('...before')
    
    const now = Date.now()
    return handler.handle().pipe(tap(() => console.log(`...after ${Date.now() - now} ms`)))
  }
}