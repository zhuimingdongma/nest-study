import { Module } from "@nestjs/common";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { GoodsEntity } from "./goods.entity";
import { GameListEntity } from "../gameList/gameList.entity";
import { Permission } from "../permission/permission.entity";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, GoodsEntity, GameListEntity]), UserModule],
  controllers:[GoodsController],
  providers: [GoodsService]
})
export class GoodsModule{}