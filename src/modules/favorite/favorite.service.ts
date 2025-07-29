import { FAVORITE_REPOSITORY } from '@/constants/repositories';

import { Inject, Injectable } from '@nestjs/common';
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
    const favorite = this.favoriteRepository.create({
      user_id: createFavoriteDto.user_id,
      article_id: createFavoriteDto.article_id,
    });

    return await this.favoriteRepository.save(favorite);
  }
}
