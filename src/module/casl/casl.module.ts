import { Module } from "@nestjs/common";
import { CaslAbilityService } from "./casl.service";

@Module({
  providers: [CaslAbilityService],
  exports: [CaslAbilityService],
})
export class CaslModule {}