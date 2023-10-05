import { Module } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { PhotoController } from "./photo.controller";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "./photo.entity";

@Module({
  controllers: [PhotoController],
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService],
})
export class PhotoModule {}