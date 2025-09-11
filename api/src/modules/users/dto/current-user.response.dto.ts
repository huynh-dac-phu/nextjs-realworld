import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponseDto {
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  username: string;

  @ApiProperty({
    example: 'A brief bio about the user',
    description: 'Bio of the user',
  })
  bio: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar image URL of the user',
  })
  image: string;
}
