import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserSerivce } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TransformInterceptor } from '@/app/interceptors/transform.interceptor';
import { Response } from '@/app/interceptors/transform.interceptor';

@Controller('users')
export class UserController {
  constructor(private userSerivce: UserSerivce) { }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @HttpCode(HttpStatus.OK)
  private async findAll(): Promise<{ message: string; data: User[] }> {
    const res = {
      message: 'success',
      data: await this.userSerivce.findAll(),
    };
    return res;
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userSerivce.create(userDto);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.userSerivce.findOne(id);
  }
}
