import { DATA_SOURCE } from '@/constants/repositories';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        name: config.get<string>('DATABASE_NAME'),
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        database: config.get<string>('DATABASE_NAME'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: config.get('DEVELOPMENT') === 'DEVELOPMENT',
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
