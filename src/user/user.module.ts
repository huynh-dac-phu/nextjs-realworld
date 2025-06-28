import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserSerivce } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserSerivce],
  controllers: [UserController],
})
export class UserModule {}
