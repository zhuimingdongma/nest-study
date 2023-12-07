import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/error/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import * as bodyParser from 'body-parser';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const microService = await NestFactory.createMicroservice<MicroserviceOptions>(

  // )
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'src/common/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/common/template'));
  app.setViewEngine('hbs');
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text({ type: 'text/html' }));
  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  // app.useGlobalFilters(new HttpExceptionFilter(httpAdapter as any));
  await app.listen(5000);
}
bootstrap();
