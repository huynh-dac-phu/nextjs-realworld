import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
  @ApiProperty({
    description: 'User profile information',
    type: Object,
    example: {
      username: 'john_doe',
      bio: 'Software Engineer',
      image: 'https://example.com/avatar.jpg',
      following: true,
    },
  })
  profile: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}
