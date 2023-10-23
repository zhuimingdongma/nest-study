import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/module/role/role.entity";
import { User } from "src/module/user/user.entity";
import { ChannelEntity } from "./channel.entity";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { GameListEntity } from "../gameList.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, ChannelEntity, GameListEntity])],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule{}