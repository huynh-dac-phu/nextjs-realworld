import { DATA_SOURCE, TAG_REPOSITORY } from '@/constants/repositories';
import { DataSource } from 'typeorm';
import { Tag } from './entities/tag.entity';

export const TagProviders = [
  {
    provide: TAG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tag),
    inject: [DATA_SOURCE],
  },
];
