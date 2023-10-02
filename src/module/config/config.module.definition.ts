import {ConfigurableModuleBuilder } from "@nestjs/common"
import { ConfigModuleOptions } from "./interface/config-module-options"

export const {ConfigurableModuleClass, MODULE_OPTIONS_TOKEN} = new ConfigurableModuleBuilder<ConfigModuleOptions>().build() 