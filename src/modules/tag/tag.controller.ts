import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagResponse } from '@/common/interfaces/tag.interface';

@ApiTags('Tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags of the article' })
  @ApiOkResponse({
    description: 'Tags retrieved successfully.',
    type: TagResponse,
  })
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
