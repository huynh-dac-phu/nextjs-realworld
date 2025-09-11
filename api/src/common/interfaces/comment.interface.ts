import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
  @ApiProperty({
    description: 'Comment details',
    type: Object,
    example: {
      id: 1,
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:22:56.637Z',
      body: 'It takes a Jacobian',
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://i.stack.imgur.com/xHWG8.jpg',
        following: false,
      },
    },
  })
  comment: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}
