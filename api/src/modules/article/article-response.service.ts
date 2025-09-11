import { ArticleResponse } from '@/common/interfaces/article.interface';
import { FollowService } from '../user-follow/user-follow.service';
import { User } from '../users/entities/user.entity';
import { ArticleService } from './article.service';

export class ArticleResponseService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly followService: FollowService,
  ) {}

  async formatArticleResponse(
    slug: string,
    user: User,
  ): Promise<ArticleResponse> {
    const isLoggedIn = !!user;
    const article = await this.articleService.getArticleBySlug(slug);

    const isFollowing = await this.followService.isFollowing(
      user.id,
      article.author.id,
    );
    const following = isLoggedIn ? isFollowing : false;

    const favorited = isLoggedIn
      ? !!article.favorites.find(favorite => favorite.user_id === user.id)
      : false;

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        favorited,
        favoritesCount: article.favorites.length,
        author: {
          username: article.author.user_name,
          bio: article.author.bio,
          image: article.author.avatar,
          following,
        },
      },
    };
  }
}
