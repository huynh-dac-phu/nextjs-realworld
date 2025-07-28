import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';
import { ArticleService } from './article.service';
import { OptionalJwtAuthGuard } from '@/modules/auth/guards/optional-guard';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { User } from '@/modules/users/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
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
}
