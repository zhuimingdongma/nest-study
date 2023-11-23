import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import helmet from 'helmet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import path, { join } from 'path';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { MenuEntity } from './module/menu/menu.entity';
import { MenuModule } from './module/menu/menu.module';
import { Permission } from './module/permission/permission.entity';
import { UUIDVersion } from 'class-validator';
import { GameListModule } from './module/gameList/gameList.module';
import { SaleAttrModule } from './module/gameList/saleAttr/saleAttr.module';
import { RoleModule } from './module/role/role.module';
import { PermissionModule } from './module/permission/permission.module';
import { GoodsAttrModule } from './module/gameList/goodsAttr/goodsAttr.module';
import { ChannelModule } from './module/gameList/channel/channel.module';
import { AreaModule } from './module/gameList/area/area.module';
import { GoodsModule } from './module/goods/goods.module';
import { OrderModule } from './module/order/order.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UploadModule } from './module/upload/upload.module';
import { RedisModule } from './module/redis/redis.module';

export const envFilePath =
  process.env.NODE_ENV === 'development'
    ? '.env'
    : process.env.NODE_ENV == 'test'
    ? '.env.test'
    : '.env.product';
@Module({
  imports: [
    UserModule,
    RedisModule,
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PSD'),
          database: configService.get('DATABASE'),
          entities: [join(__dirname, 'module', '**', '*.entity{.ts,.js}')],
          synchronize: true,
        };
      },
    }),
    RoleModule,
    PermissionModule,
    AuthModule,
    MenuModule,
    GameListModule,
    SaleAttrModule,
    GoodsAttrModule,
    ChannelModule,
    AreaModule,
    GoodsModule,
    OrderModule,
    UploadModule,
  ],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: CacheInterceptor,
  //   },
  // ],
})
export class AppModule implements NestModule {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    this.menuRepository.findAndCount().then(([_, count]) => {
      if (count <= 0) {
        const menuList: Partial<MenuEntity>[] = [
          { name: '首页', path: '/dashboard', icon: '' },
          { name: '权限管理', path: '/perm', icon: '' },
          { name: '用户管理', path: '/perm_users', icon: '' },
          { name: '角色管理', path: '/perm_roles', icon: '' },
          { name: '系统设置', path: '/system', icon: '' },
          { name: '资源管理', path: '/system_menus', icon: '' },
          { name: '文件列表', path: '/system_oss', icon: '' },
          { name: '重置密码', path: '/perm_users:resetPw', icon: '' },
          { name: '部门管理', path: '/perm_depts', icon: '' },
          { name: '岗位管理', path: '/perm_posts', icon: '' },
        ];

        for (let index = 0; index < menuList.length; index++) {
          const element = menuList[index];
          const menu = new MenuEntity();

          for (const key in element) {
            if (Object.prototype.hasOwnProperty.call(element, key)) {
              const value = element[key];
              menu[key] = value;
            }
          }
          this.menuRepository.save(menu);
        }
        let adminId: UUIDVersion | null = null;
        let commonId: UUIDVersion | null = null;

        this.permissionRepository
          .find({ where: { name: 'admin' } })
          .then((res) => {
            adminId = res[0].id;
          });

        this.permissionRepository
          .find({ where: { name: 'common' } })
          .then((res) => {
            commonId = res[0].id;
          });

        this.menuRepository
          .find({
            where: [
              { name: '首页' },
              { name: '资源管理' },
              { name: '文件列表' },
              { name: '重置密码' },
            ],
          })
          .then((list) => {
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              this.menuRepository
                .createQueryBuilder()
                .relation(MenuEntity, 'permission')
                .of(element.id)
                .add(commonId);
            }
          });

        this.menuRepository
          .find({
            where: [
              { name: '权限管理' },
              { name: '用户管理' },
              { name: '角色管理' },
              { name: '系统设置' },
              { name: '部门管理' },
              { name: '岗位管理' },
            ],
          })
          .then((list) => {
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              this.menuRepository
                .createQueryBuilder()
                .relation(MenuEntity, 'permission')
                .of(element.id)
                .add(adminId);
            }
          });
      }
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, helmet())
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
