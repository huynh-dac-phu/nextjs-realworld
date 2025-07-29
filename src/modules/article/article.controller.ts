import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';
import { ArticleService } from './article.service';
import { OptionalJwtAuthGuard } from '@/modules/auth/guards/optional-guard';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { User } from '@/modules/users/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { FavoriteService } from '../favorite/favorite.service';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getArticles() {
    try {
      const data = await this.articleService.getArticle();
      return {
        data: data?.map(article => ({
          slug: article.slug,
          title: article.title,
          description: article.description,
          body: article.body,
          createdAt: article.created_at,
          updatedAt: article.updated_at,
          favorited: true, // TODO
          favoritesCount: 0, // TODO
          author: {
            username: article.author.user_name,
            bio: article.author.bio,
            image: article.author.avatar,
            following: true, // TODO
          },
        })),
      };
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  create(
    @Req() req: { user: User },
    @Body('article') articleDto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(req.user.id, articleDto);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':slug/favorite')
  async favoriteArticle(
    @Req() req: { user: User },
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.getArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }
    await this.favoriteService.createFavorite({
      user_id: req.user.id,
      article_id: article.id,
    });
  }
}
