import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaleAttrController } from "./saleAttr.controller";
import { SaleAttrService } from "./saleAttr.service";
import { SaleAttrEntity } from "./saleAttr.entity";
import { GameListEntity } from "../gameList.entity";
import { User } from "src/module/user/user.entity";
import { Role } from "src/module/role/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SaleAttrEntity, GameListEntity, User, Role])],
  controllers: [SaleAttrController],
  providers: [SaleAttrService],
  exports: [SaleAttrService]
})
export class SaleAttrModule {}