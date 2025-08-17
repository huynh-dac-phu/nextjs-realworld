import { ApiProperty } from '@nestjs/swagger';

export class TagResponse {
  @ApiProperty({
    description: 'List of tags associated with the article',
    type: [String],
    example: ['tag1', 'tag2', 'tag3'],
  })
  tags: string[];
}
