import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { ValidationException } from '@/common/exceptions/error.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponse } from '@/common/interfaces/user.interface';

@ApiTags('User')
@Controller('user')
export class CurrentUserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOkResponse({
    description: 'Current user information retrieved successfully.',
    type: UserResponse,
  })
  async getCurrentUser(
    @Req() req: { user: User },
  ): Promise<Partial<UserResponse>> {
    const { user: userByJWT } = req;
    const user = await this.userService.findById(userByJWT.id.toString());

    return {
      user: {
        email: user?.email,
        username: user?.user_name,
        bio: user?.bio,
        image: user?.avatar,
        accessToken: user?.access_token,
        refreshToken: user?.refresh_token,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Follow the body structure',
    type: RegisterUserDto,
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: UserResponse,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  async create(@Body('user') userDto: RegisterUserDto) {
    try {
      await this.userService.create(userDto);
      return 'User created successfully';
    } catch (error) {
      throw new ValidationException(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch()
  @ApiOperation({ summary: 'Update current user info' })
  @ApiBody({
    description: 'Follow the body structure',
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UserResponse,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  async updateCurrentUser(
    @Req() req: { user: User },
    @Body('user') userDto: UpdateUserDto,
  ) {
    try {
      const { user: userByJWT } = req;
      await this.userService.updateUser(userByJWT.id, userDto);
      return 'User created successfully';
    } catch (error) {
      throw new ValidationException(error);
    }
  }
}
