import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { articleProviders } from './article.provider';
import { DatabaseModule } from '@/database/database.module';
import { FollowModule } from '../user-follow/user-follow.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TagModule } from '../tag/tag.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    DatabaseModule,
    FollowModule,
    TagModule,
    FavoriteModule,
    CommentModule,
  ],
  providers: [...articleProviders, ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
