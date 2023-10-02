import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm"


export const databaseProvider = [{
  provide: 'connectDatabase',
  useFactory: async (config: ConfigService) => {
    console.log('config.get', config.get('DATABASE_USER'));
    const dataSource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'YUGE1858382..*',
      database: 'nest_study',
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true
    })
    return dataSource.initialize();
  },
  inject: [ConfigService]
}]