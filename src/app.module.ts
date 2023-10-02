import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './module/cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import Cors from 'cors'
import helmet from 'helmet';
// import { ConfigModule } from './module/config/config.module';
// import { PhotoModule } from './module/photo/photo.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm';
import { join } from 'path';
import { UserModule } from './module/user/user.module';
import { User } from './module/user/user.entity';
import { PhotoModule } from './module/photo/photo.module';
import { Photo } from './module/photo/photo.entity';
import { CacheModule } from '@nestjs/cache-manager';

const envFilePath = process.env.NODE_ENV === 'development' ? '.env.development' : process.env.NODE_ENV === 'test' ? '.env.test' : '.env.product'
@Module({
  imports: [CatsModule, PhotoModule,UserModule, ConfigModule.forRoot({envFilePath}), TypeOrmModule.forRoot({
    autoLoadEntities: true,
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'YUGE1858382..*',
    database: 'nest_study',
    entities: [
      User,
      Photo
    ],
    synchronize: true
  }),
  CacheModule.register({
    isGlobal: true
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, helmet())
      .forRoutes({path: 'cats', method: RequestMethod.GET})
  }
}
