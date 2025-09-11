import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { OptionalJwtAuthGuard } from '@/modules/auth/guards/optional-guard';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { User } from '@/modules/users/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { FavoriteService } from '@/modules/favorite/favorite.service';
import { FollowService } from '@/modules/user-follow/user-follow.service';
import { TagService } from '@/modules/tag/tag.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CommentService } from '@/modules/comment/comment.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentBody } from './dto/comment.dto';
import { CreateCommentDto } from '@/modules/comment/dto/create-comment.dto';
import { ArticleResponse } from '@/common/interfaces/article.interface';
import { CommentResponse } from '@/common/interfaces/comment.interface';
import { ArticleResponseService } from './article-response.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly favoriteService: FavoriteService,
    private readonly followService: FollowService,
    private readonly tagService: TagService,
    private readonly commentService: CommentService,
    private readonly articleResponseService: ArticleResponseService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiOkResponse({
    description: 'List of articles',
    type: [ArticleResponse],
  })
  async getArticles(@Req() req: { user: User }) {
    try {
      const data = await this.articleService.getArticles();

      const isLoggedIn = !!req?.user?.id;

      const currentUserFollowings = await this.followService.getFollowers(
        req.user?.id,
      );
      const arrayIdsFollowing = currentUserFollowings.map(
        userFollow => userFollow.following_id,
      );

      return {
        articles: data?.map(article => {
          const favorited = isLoggedIn
            ? !!article.favorites.find(
                favorite => favorite.user_id === req.user.id,
              )
            : false;

          return {
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
              id: article.author.id,
              username: article.author.user_name,
              bio: article.author.bio,
              image: article.author.avatar,
              following: arrayIdsFollowing.includes(article.author.id),
            },
          };
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiOkResponse({
    description: 'Article details',
    type: ArticleResponse,
  })
  async getArticleBySlug(
    @Param('slug') slug: string,
    @Req() req: { user: User },
  ) {
    try {
      return this.articleResponseService.formatArticleResponse(slug, req.user);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({
    type: CreateArticleDto,
  })
  @ApiCreatedResponse({
    description: 'Article created successfully.',
    type: ArticleResponse,
  })
  async create(
    @Req() req: { user: User },
    @Body('article') articleDto: CreateArticleDto,
  ) {
    const articleCreated = await this.articleService.createArticle(
      req.user.id,
      articleDto,
    );

    if (articleDto.tagList) {
      const tags = [...articleDto.tagList].map(tag => ({ name: tag }));
      await this.tagService.createTags(tags);
    }
    return this.articleResponseService.formatArticleResponse(
      articleCreated.slug,
      req.user,
    );
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put(':slug')
  @ApiOperation({ summary: 'Update a article by slug' })
  @ApiBody({
    type: UpdateArticleDto,
  })
  @ApiOkResponse({
    description: 'Article updated successfully.',
    type: ArticleResponse,
  })
  async updateArticle(
    @Body('article') updateArticleDto: UpdateArticleDto,
    @Param('slug') slug: string,
    @Req() req: { user: User },
  ) {
    try {
      const isAuthor = await this.articleService.isAuthorOfArticle(
        slug,
        req.user.id,
      );
      if (!isAuthor) {
        throw new NotFoundException('You are not the author of this article');
      }

      await this.articleService.updateArticle(slug, updateArticleDto);

      return this.articleResponseService.formatArticleResponse(slug, req.user);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a article by slug' })
  @ApiOkResponse({
    description: 'Article deleted successfully.',
  })
  async deleteArticle(@Param('slug') slug: string, @Req() req: { user: User }) {
    try {
      const isAuthor = await this.articleService.isAuthorOfArticle(
        slug,
        req.user.id,
      );
      if (!isAuthor) {
        throw new NotFoundException('You are not the author of this article');
      }

      return await this.articleService.deleteArticle(slug);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':slug/favorite')
  @ApiOperation({ summary: 'Favorite an article' })
  @ApiOkResponse({
    description: 'Article favorited successfully.',
  })
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

    return this.articleResponseService.formatArticleResponse(slug, req.user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':slug/favorite')
  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiOkResponse({
    description: 'Article unfavorited successfully.',
  })
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @Req() req: { user: User },
  ) {
    try {
      const article = await this.articleService.getArticleBySlug(slug);
      if (!article) {
        throw new NotFoundException(`Article with slug ${slug} not found`);
      }
      await this.favoriteService.deleteFavorite(req.user.id, article.id);

      return this.articleResponseService.formatArticleResponse(slug, req.user);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':slug/comments')
  @ApiOperation({ summary: 'Get comments by article slug' })
  @ApiOkResponse({
    description: 'List of comments for the article',
    type: [CommentResponse],
  })
  async getCommentsByArticle(
    @Param('slug') slug: string,
    @Req() req: { user: User },
  ) {
    try {
      const article = await this.articleService.getArticleBySlug(slug);
      if (!article) {
        throw new NotFoundException(`Article with slug ${slug} not found`);
      }
      const currentUserFollowings = await this.followService.getFollowers(
        req.user?.id,
      );
      const arrayIdsFollowing = currentUserFollowings.map(
        userFollow => userFollow.following_id,
      );

      const commens = await this.commentService.getAllCommentByArticleId(
        article.id,
      );

      return {
        comments: commens?.map(comment => ({
          id: comment.id,
          body: comment.body,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          author: {
            username: comment.author.user_name,
            bio: comment.author.bio,
            image: comment.author.avatar,
            following: arrayIdsFollowing.includes(comment.author.id),
          },
        })),
      };
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':slug/comments')
  @ApiOperation({ summary: 'Create a comment on an article' })
  @ApiBody({
    description: 'Comment body',
    type: CreateCommentBody,
  })
  @ApiCreatedResponse({
    description: 'Comment created successfully.',
    type: CommentResponse,
  })
  async createComment(
    @Param('slug') slug: string,
    @Req() req: { user: User },
    @Body('comment') comment: CreateCommentDto,
  ) {
    try {
      const article = await this.articleService.getArticleBySlug(slug);
      if (!article) {
        throw new NotFoundException(`Article with slug ${slug} not found`);
      }
      return await this.commentService.createComment({
        articleId: article.id,
        userId: req.user.id,
        body: comment.body,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put(':slug/comments/:commentId')
  @ApiOperation({ summary: 'Update a comment on an article' })
  @ApiBody({
    description: 'Comment body',
    type: CreateCommentBody,
  })
  @ApiOkResponse({
    description: 'Comment updated successfully.',
    type: CommentResponse,
  })
  async updateComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
    @Body('comment') comment: CreateCommentDto,
    @Req() req: { user: User },
  ) {
    try {
      return await this.commentService.updateComment(
        req.user.id,
        commentId,
        comment.body,
      );
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':slug/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment on an article' })
  @ApiOkResponse({
    description: 'Comment deleted successfully.',
  })
  async deleteComment(
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
    @Req() req: { user: User },
  ) {
    try {
      return await this.commentService.deleteComment(req.user.id, commentId);
    } catch (error) {
      console.log(error);
    }
  }
}
