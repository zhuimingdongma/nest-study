import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LogService } from 'src/module/log/log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LogService) private logService: LogService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const stack = exception.stack;
    const message = exception.message;
    
    switch (status) {
      case HttpStatus.INTERNAL_SERVER_ERROR:
        this.logService.error(message, stack)
        break;
      case HttpStatus.OK:
        this.logService.info(message)
        break;
      case HttpStatus.FAILED_DEPENDENCY:
        this.logService.warn(message)
        break;
      default:
        this.logService.info(message)
    }
    
    response.status(status).json({
      stack,
      code: status,
      message,
      path: request.url,
    });
  }
}
