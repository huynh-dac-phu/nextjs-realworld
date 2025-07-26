import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserFollow } from './entities/user-follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FOLLOW_REPOSITORY } from '@/constants/repositories';
import { FollowDto } from './dto/user-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @Inject(FOLLOW_REPOSITORY)
    @InjectRepository(UserFollow)
    private userFollowRepository: Repository<UserFollow>,
  ) {}

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.userFollowRepository.exists({
      select: ['follower_id'],
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
    return follow;
  }

  followUser(followDto: FollowDto) {
    const follow = this.userFollowRepository.create({
      follower_id: followDto.follower_id,
      following_id: followDto.following_id,
    });

    return this.userFollowRepository.save(follow);
  }

  async unfollowUser(followDto: FollowDto) {
    try {
      return await this.userFollowRepository.softDelete({
        follower_id: followDto.follower_id,
        following_id: followDto.following_id,
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }
}
