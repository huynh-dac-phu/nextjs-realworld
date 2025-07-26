import { DATA_SOURCE, USER_REPOSITORY } from '@/constants/repositories';
import { DataSource } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';

export const profileProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
