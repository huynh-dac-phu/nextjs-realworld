import { DATA_SOURCE } from '@/constants/repositories';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'sqlite',
        name: 'realworld',
        database: config.get('DATABASE_PATH') || 'realworld.sqlite',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: config.get('DEVELOPMENT') === 'DEVELOPMENT',
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
