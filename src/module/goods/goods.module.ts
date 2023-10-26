import { Module } from "@nestjs/common";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { GoodsEntity } from "./goods.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, GoodsEntity])],
  controllers:[GoodsController],
  providers: [GoodsService]
})
export class GoodsModule{}