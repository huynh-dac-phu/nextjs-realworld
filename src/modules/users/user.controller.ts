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
import {
  ResourceNotFoundException,
  ValidationException,
} from '@/common/exceptions/error.exception';
import { PaginationMeta } from '@/interfaces/pagination.interface';
import { PaginationDto } from '@/modules/pagination/pagination.dto';
import { JwtAccessTokenGuard } from '@/modules/auth/guards/jwt-access-token.guard';
import { Public } from '@/modules/auth/decorators/auth.decorators';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorators';
import { USER_ROLE } from '@/modules/user-role/entities/user-role.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  private async findAll(@Query() query: PaginationDto): Promise<{
    message: string;
    data: {
      data: Partial<User>[];
      pagination: PaginationMeta;
    };
  }> {
    try {
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
    } catch (error) {
      throw new ValidationException(error);
    }
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
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return {
      message: 'success',
    };
  }
}
