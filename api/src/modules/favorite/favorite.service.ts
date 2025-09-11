import { FAVORITE_REPOSITORY } from '@/constants/repositories';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(FAVORITE_REPOSITORY)
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    try {
      const favorite = this.favoriteRepository.create({
        user_id: createFavoriteDto.user_id,
        article_id: createFavoriteDto.article_id,
      });

      return await this.favoriteRepository.save(favorite);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFavorite(userId: number, articleId: number) {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: { article_id: articleId, user_id: userId },
      });
      if (!favorite) {
        throw new NotFoundException('Favorite not found');
      }
      return await this.favoriteRepository.softDelete(favorite.id);
    } catch (error) {
      console.log(error);
    }
  }

  async isFavorited(useId: number, articleId: number) {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: {
          user_id: useId,
          article_id: articleId,
        },
      });
      return !!favorite;
    } catch (error) {
      console.log(error);
    }
  }
}
