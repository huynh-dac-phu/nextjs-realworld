import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { DatabaseModule } from '@/database/database.module';
import { ProfileService } from './profile.service';
import { profileProviders } from './profile.provider';
import { FollowModule } from '@/modules/user-follow/user-follow.module';
import { UserModule } from '@/modules/users/user.module';

@Module({
  imports: [DatabaseModule, FollowModule, UserModule],
  providers: [...profileProviders, ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
