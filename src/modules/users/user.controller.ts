import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceNotFoundException } from '@/common/exceptions/app.exception';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  private async findAll(): Promise<{ message: string; data: User[] }> {
    return {
      message: 'success',
      data: await this.userService.findAll(),
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
