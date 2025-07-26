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
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class CurrentUserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async getCurrentUser(@Req() req: { user: User }) {
    const { user: userByJWT } = req;
    const user = await this.userService.findById(userByJWT.id.toString());

    return {
      data: {
        email: user?.email,
        username: user?.user_name,
        bio: user?.bio,
        image: user?.avatar,
      },
    };
  }

  @Post()
  async create(@Body('user') userDto: CreateUserDto) {
    try {
      await this.userService.create(userDto);
      return 'User created successfully';
    } catch (error) {
      throw new ValidationException(error);
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch()
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
