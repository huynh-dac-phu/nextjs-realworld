import { ARTICLE_REPOSITORY } from '@/constants/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async getArticle() {
    try {
      // TODO
      const res = await this.articleRepository.find({
        relations: ['author'],
        order: { created_at: 'DESC' },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async createArticle(userId: number, articleDto: CreateArticleDto) {
    try {
      console.log({ userId });
      const article = this.articleRepository.create({
        user_id: userId,
        title: articleDto.title,
        description: articleDto.description,
        body: articleDto.body,
      });

      return await this.articleRepository.save(article);
    } catch (error) {
      console.log(error);
    }
  }
}
