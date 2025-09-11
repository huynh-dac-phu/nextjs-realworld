import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { favoriteProviders } from './favorite.provider';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [DatabaseModule],
  providers: [...favoriteProviders, FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
