import { ARTICLE_REPOSITORY } from '@/constants/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async getArticles() {
    try {
      const res = await this.articleRepository.find({
        relations: ['author', 'favorites'],
        order: { created_at: 'DESC' },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({
        where: { slug },
        relations: ['author', 'favorites'],
      });
      if (!article) {
        throw new NotFoundException(`Article with slug ${slug} not found`);
      }
      return article;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createArticle(userId: number, articleDto: CreateArticleDto) {
    try {
      const article = this.articleRepository.create({
        user_id: userId,
        title: articleDto.title,
        description: articleDto.description,
        body: articleDto.body,
        tagList: articleDto.tagList,
      });

      return await this.articleRepository.save(article);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async isAuthorOfArticle(slug: string, userId: number) {
    try {
      const article = await this.getArticleBySlug(slug);
      if (!article) {
        throw new NotFoundException(`Article with slug ${slug} not found`);
      }

      return article.author.id === userId;
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(slug: string, updateArticleDto: UpdateArticleDto) {
    try {
      return await this.articleRepository.update({ slug }, updateArticleDto);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteArticle(slug: string) {
    try {
      return await this.articleRepository.softDelete({ slug });
    } catch (error) {
      console.log(error);
    }
  }
}
