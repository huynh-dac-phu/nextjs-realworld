import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { DATA_SOURCE, USER_REPOSITORY } from '@/constants/repositories';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
