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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProfileResponse } from '@/common/interfaces/profile.interface';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly followService: FollowService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username')
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiOkResponse({
    description: 'User profile retrieved successfully.',
    type: ProfileResponse,
  })
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
      profile: {
        username: profile?.user_name,
        bio: profile?.bio,
        image: profile?.avatar,
        following: following,
      },
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':username/follow')
  @ApiOperation({ summary: 'Follow a user by username' })
  @ApiCreatedResponse({
    description: 'User followed successfully.',
    type: ProfileResponse,
  })
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
    await this.followService.followUser({
      follower_id: userByJWT.id,
      following_id: user.id,
    });

    return {
      profile: {
        username: user?.user_name,
        bio: user?.bio,
        image: user?.avatar,
        following: true,
      },
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':username/follow')
  @ApiOperation({
    summary: 'Unfollow a user by username',
  })
  @ApiOkResponse({
    description: 'User unfollowed successfully.',
    type: ProfileResponse,
  })
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

    await this.followService.unfollowUser({
      follower_id: followerUser.id,
      following_id: followingUser.id,
    });

    return {
      profile: {
        username: followingUser?.user_name,
        bio: followingUser?.bio,
        image: followingUser?.avatar,
        following: false,
      },
    };
  }
}
