import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceNotFoundException } from '@/common/exceptions/error.exception';
import { PaginationResponse } from '@/interfaces/pagination.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  private async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    message: string;
    data: PaginationResponse<User>;
  }> {
    const { data, pagination } = await this.userService.findAll({
      page: +page,
      limit: +limit,
    });
    return {
      message: 'success',
      data: {
        data,
        pagination,
      },
    };
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Get(':id')
  async detail(
    @Param('id') id: string,
  ): Promise<{ message: string; data: User }> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ResourceNotFoundException('User', id);
    }
    return {
      message: 'success',
      data: user,
    };
  }
}
