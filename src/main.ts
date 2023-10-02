import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/error/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  // app.useGlobalFilters(new HttpExceptionFilter(httpAdapter as any));
  await app.listen(4000); 
}
bootstrap();
