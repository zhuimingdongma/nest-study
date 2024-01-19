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
    const request = ctx.getRequest();
    try {
      const { user: { username } = { username: '' } } = request || {};
      const status = exception.getStatus();
      const stack = exception.stack;
      let message = exception.message;
      let responseMsg: string[] = [''];
      message = `用户${username} ${message}`;

      switch (status) {
        case HttpStatus.INTERNAL_SERVER_ERROR:
          this.logService.error(message, stack);
          break;
        case HttpStatus.OK:
          this.logService.info(message);
          break;
        case HttpStatus.BAD_REQUEST:
          const response = exception.getResponse();
          responseMsg = response['message'] as string[];
          this.logService.warn(JSON.stringify(responseMsg) + `用户${username}`);
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          this.logService.warn(message);
          break;
        default:
          this.logService.info(message);
      }

      response.status(status).json({
        stack: status === HttpStatus.INTERNAL_SERVER_ERROR ? stack : undefined,
        code: status,
        message:
          status === HttpStatus.BAD_REQUEST ? responseMsg : exception.message,
        path: request.url,
      });
    } catch (err) {
      response.status(500).json({
        code: 500,
        message: err.message || '服务器出错',
        path: request.url,
        stack: err.stack,
      });
      this.logService.error(err.message || '服务器出错', err.stack);
    }
  }
}
