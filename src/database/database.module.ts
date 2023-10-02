import { Module } from "@nestjs/common";
import { databaseProvider } from "./database.providers";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [ConfigModule],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}