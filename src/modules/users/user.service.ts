import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/constants/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Put, Patch, Delete } from '@nestjs/common';
import { PaginationResponse } from '@/interfaces/pagination.interface';
import { PaginationService } from '@/modules/pagination/pagination.service';
import { PaginationDto } from '@/modules/pagination/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(params: PaginationDto): Promise<PaginationResponse<User>> {
    return this.paginationService.paginate<User>(this.userRepository, params);
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
