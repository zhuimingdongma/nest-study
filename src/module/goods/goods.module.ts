import { Module } from "@nestjs/common";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { GoodsEntity } from "./goods.entity";
import { GameListEntity } from "../gameList/gameList.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, GoodsEntity, GameListEntity])],
  controllers:[GoodsController],
  providers: [GoodsService]
})
export class GoodsModule{}