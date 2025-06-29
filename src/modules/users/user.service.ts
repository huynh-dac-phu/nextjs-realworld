import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/constants/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Put, Patch, Delete } from '@nestjs/common';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponse } from '@/interfaces/pagination.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(params: PaginationDto): Promise<PaginationResponse<User>> {
    const { page, limit } = params;
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    const start = (page - 1) * limit;
    const end = start + limit;
    const total_page = Math.ceil(users.length / limit);

    const has_prev = page > total_page;
    const has_next = end < users.length;

    return {
      data: users.slice(start, end),
      pagination: {
        total: users.length,
        page,
        total_page,
        limit,
        has_prev,
        has_next,
      },
    };
  }

  async create(userDto: CreateUserDto) {
    const user = this.userRepository.create({
      name: userDto.name,
      age: userDto.age,
    });
    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  @Put(':id')
  @Patch(':id')
  @Delete(':id')
  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}
