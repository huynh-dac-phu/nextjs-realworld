import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { followProviders } from './user-follow.provider';
import { FollowService } from './user-follow.service';

@Module({
  imports: [DatabaseModule],
  providers: [...followProviders, FollowService],
  exports: [FollowService],
})
export class FollowModule {}
