import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    type: Object,
    example: {
      accessToken: 'jwt-access-token',
      refreshToken: 'jwt-refresh-token',
      email: 'john_doe@email.com',
      username: 'john_doe',
      bio: 'Software Engineer',
      image: 'https://example.com/avatar.jpg',
    },
    description: 'User authentication tokens and details',
  })
  user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    username: string;
    bio: string;
    image: string;
  };
}
