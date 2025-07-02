import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceNotFoundException } from '@/common/exceptions/error.exception';
import { PaginationMeta } from '@/interfaces/pagination.interface';
import { PaginationDto } from '@/modules/pagination/pagination.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  private async findAll(@Query() query: PaginationDto): Promise<{
    message: string;
    data: {
      data: User[];
      pagination: PaginationMeta;
    };
  }> {
    const { data, pagination } = await this.userService.findAll(query);
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
