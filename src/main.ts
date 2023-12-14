import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import * as bodyParser from 'body-parser';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });
  app.useStaticAssets(join(__dirname, 'src/common/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/common/template'));
  app.setViewEngine('hbs');
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text({ type: 'text/html' }));
  app.use(bodyParser.json());
  await app.listen(5000);
}
bootstrap();
