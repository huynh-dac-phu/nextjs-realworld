import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceNotFoundException } from '@/common/exceptions/error.exception';
import { PaginationMeta } from '@/interfaces/pagination.interface';
import { PaginationDto } from '@/modules/pagination/pagination.dto';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { Public } from '../auth/decorators/auth.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAccessTokenGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  private async findAll(@Query() query: PaginationDto): Promise<{
    message: string;
    data: {
      data: Partial<User>[];
      pagination: PaginationMeta;
    };
  }> {
    const { data, pagination } = await this.userService.findAll(query);
    return {
      message: 'success',
      data: {
        data: data.map(user => ({
          id: user.id,
          name: user.user_name,
          email: user.email,
          bio: user.bio,
          image: user.avatar,
          role: user.role,
        })),
        pagination,
      },
    };
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    try {
      return this.userService.create(userDto);
    } catch (error) {
      console.log(error);
      // throw new ValidationException(error);
    }
  }

  @Get(':id')
  @Public()
  async detail(
    @Param('id') id: string,
  ): Promise<{ message: string; data: User }> {
    const user = await this.userService.findOne({ id });
    if (!user) {
      throw new ResourceNotFoundException('User', id);
    }
    return {
      message: 'success',
      data: user,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
