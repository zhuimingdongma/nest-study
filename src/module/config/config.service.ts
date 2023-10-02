import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigModuleOptions } from './interface/config-module-options';
import { MODULE_OPTIONS_TOKEN } from './config.module.definition';
// import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig
 
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions) {

    // const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    // console.log('__dirname: ', __dirname);
    const envFile = path.resolve(__dirname, '../../', options.folder);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}