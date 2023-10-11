import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/error/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalInterceptors(new ResponseInterceptor)
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted: true}))
  // app.useGlobalFilters(new HttpExceptionFilter(httpAdapter as any));
  await app.listen(5000); 
}
bootstrap();
