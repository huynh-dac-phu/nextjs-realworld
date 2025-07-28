import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { User } from '@/modules/users/entities/user.entity';
import { FollowService } from '@/modules/user-follow/user-follow.service';
import { UserService } from '@/modules/users/user.service';
import { OptionalJwtAuthGuard } from '@/modules/auth/guards/optional-guard';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly followService: FollowService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @Req() req: { user: User },
  ) {
    let following = false;
    const profile = await this.profileService.getProfile(username);

    if (profile && req.user) {
      following = await this.followService.isFollowing(req.user.id, profile.id);
    }

    return {
      data: {
        profile: {
          username: profile?.user_name,
          bio: profile?.bio,
          image: profile?.avatar,
          following: following,
        },
      },
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':username/follow')
  async followUser(
    @Param('username') username: string,
    @Req() req: { user: User },
  ) {
    const user = await this.userService.findOne({
      user_name: username,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id === req.user.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const { user: userByJWT } = req;
    return this.followService.followUser({
      follower_id: userByJWT.id,
      following_id: user.id,
    });
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':username/follow')
  async unfollowUser(
    @Param('username') username: string,
    @Req() req: { user: User },
  ) {
    const followerUser = req.user;
    const followingUser = await this.userService.findOne({
      user_name: username,
    });

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }

    return this.followService.unfollowUser({
      follower_id: followerUser.id,
      following_id: followingUser.id,
    });
  }
}
