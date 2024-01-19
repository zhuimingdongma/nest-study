import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/module/role/role.entity';
import { AreaEntity } from './area.entity';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { User } from 'src/module/user/user.entity';
import { ChannelEntity } from '../channel/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, AreaEntity, ChannelEntity])],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
