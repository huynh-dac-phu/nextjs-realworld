import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CurrentUserController } from './current-user.controller';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService, PaginationService],
  controllers: [UserController, CurrentUserController],
  exports: [UserService],
})
export class UserModule {}
