import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User} from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CaslModule } from '../casl/casl.module';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), CaslModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}