import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '3600s'}
  })],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule]
})
export class UserModule {}