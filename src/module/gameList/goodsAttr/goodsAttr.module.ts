import { Module } from "@nestjs/common";
import { GoodsAttrController } from "./goodsAttr.controller";
import { GoodsAttrService } from "./goodsAttr.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoodsAttrEntity } from "./goodsAttr.entity";
import { User } from "src/module/user/user.entity";
import { Role } from "src/module/role/role.entity";
import { GameListEntity } from "../gameList.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsAttrEntity, User, Role, GameListEntity])],
  controllers: [GoodsAttrController],
  providers: [GoodsAttrService],
  exports: [GoodsAttrService]
})
export class GoodsAttrModule {}