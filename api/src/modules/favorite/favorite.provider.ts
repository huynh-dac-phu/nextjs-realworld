import { DATA_SOURCE, FAVORITE_REPOSITORY } from '@/constants/repositories';
import { DataSource } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

export const favoriteProviders = [
  {
    provide: FAVORITE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Favorite),
    inject: [DATA_SOURCE],
  },
];
