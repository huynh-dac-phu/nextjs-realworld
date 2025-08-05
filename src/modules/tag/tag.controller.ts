import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags() {
    try {
      const tags = await this.tagService.getTags();
      return {
        data: tags?.map(tag => tag.name),
      };
    } catch {
      throw new Error('Failed to fetch tags');
    }
  }
}
