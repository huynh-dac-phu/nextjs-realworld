import { DATA_SOURCE, ARTICLE_REPOSITORY } from '@/constants/repositories';
import { DataSource } from 'typeorm';
import { Article } from '@/modules/article/entities/article.entity';

export const articleProviders = [
  {
    provide: ARTICLE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Article),
    inject: [DATA_SOURCE],
  },
];
