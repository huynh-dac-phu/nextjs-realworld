import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/constants/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Put, Patch, Delete } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
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
