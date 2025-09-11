import { DATA_SOURCE, FOLLOW_REPOSITORY } from '@/constants/repositories';
import { DataSource } from 'typeorm';
import { UserFollow } from './entities/user-follow.entity';

export const followProviders = [
  {
    provide: FOLLOW_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserFollow),
    inject: [DATA_SOURCE],
  },
];
