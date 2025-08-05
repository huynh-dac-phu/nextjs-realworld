import { Module } from '@nestjs/common';
import { TagProviders } from './tag.provider';
import { TagService } from './tag.service';
import { DatabaseModule } from '@/database/database.module';
import { TagController } from './tag.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...TagProviders, TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
