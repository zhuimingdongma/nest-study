import { Module } from '@nestjs/common';
import { CollectController } from './collect.controller';
import { CollectService } from './collect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectEntity } from './collect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectEntity])],
  controllers: [CollectController],
  providers: [CollectService],
})
export class CollectModule {}
