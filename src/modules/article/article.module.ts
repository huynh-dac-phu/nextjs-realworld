import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { articleProviders } from './article.provider';
import { DatabaseModule } from '@/database/database.module';
import { UserModule } from '../users/user.module';
import { FollowModule } from '../user-follow/user-follow.module';

@Module({
  imports: [DatabaseModule, UserModule, FollowModule],
  providers: [...articleProviders, ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
