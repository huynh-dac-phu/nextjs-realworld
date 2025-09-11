import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsNumber()
  follower_id: number;

  @IsNotEmpty()
  @IsNumber()
  following_id: number;
}
