import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { articleProviders } from './article.provider';
import { DatabaseModule } from '@/database/database.module';
import { FollowModule } from '@/modules/user-follow/user-follow.module';
import { FavoriteModule } from '@/modules/favorite/favorite.module';
import { TagModule } from '@/modules/tag/tag.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { ArticleResponseService } from './article-response.service';

@Module({
  imports: [
    DatabaseModule,
    FollowModule,
    TagModule,
    FavoriteModule,
    CommentModule,
  ],
  providers: [...articleProviders, ArticleService, ArticleResponseService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
