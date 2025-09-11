import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { CommentProvider } from './comment.provider';
import { CommentService } from './comment.service';

@Module({
  imports: [DatabaseModule],
  providers: [...CommentProvider, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
