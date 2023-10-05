import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuEntity } from "./menu.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  exports: [TypeOrmModule]
})
export class MenuModule {}