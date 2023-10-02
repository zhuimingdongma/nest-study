import { Module, DynamicModule } from "@nestjs/common";
import { ConfigService } from "./config.service";
import {ConfigurableModuleClass} from './config.module.definition'

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule extends ConfigurableModuleClass {
  // static register(options: Record<string, any>) : DynamicModule {
  //   return {
  //     module: ConfigModule,
  //     providers: [
  //       {
  //         provide: 'CONFIG_MODULE',
  //         useValue: options
  //       },
  //       ConfigService
  //     ],
  //     exports: [ConfigService]
  //   }
  // }
}