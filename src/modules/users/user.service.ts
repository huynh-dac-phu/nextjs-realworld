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
import { UpdateUserDto } from './dto/update-user.dto';

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
      first_name: userDto.firstName,
      last_name: userDto.lastName,
      user_name: userDto.userName,
      email: userDto.email,
      password: userDto.password,
    });
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async findOne(condition): Promise<User | null> {
    return this.userRepository.findOne({ where: condition });
  }

  @Put(':id')
  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.updateAll(updateUserDto);
  }

  @Patch(':id')
  @Delete(':id')
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }
}
