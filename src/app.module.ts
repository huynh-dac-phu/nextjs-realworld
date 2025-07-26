import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/modules/users/user.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { FollowModule } from '@/modules/user-follow/user-follow.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    ProfileModule,
    FollowModule,
    AuthModule,
  ],
})
export class AppModule {}
