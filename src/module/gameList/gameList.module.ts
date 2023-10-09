import { Module } from "@nestjs/common";
import { GameListService } from "./gameList.service";
import { GameListController } from "./gameList.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameListEntity } from "./gameList.entity";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GameListEntity, User, Role])],
  controllers: [GameListController],
  providers: [GameListService],
  exports: [GameListService]
})
export class GameListModule {}