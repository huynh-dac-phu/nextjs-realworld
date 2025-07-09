import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/constants/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationResponse } from '@/interfaces/pagination.interface';
import { PaginationService } from '@/modules/pagination/pagination.service';
import { PaginationDto } from '@/modules/pagination/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationException } from '@/common/exceptions/error.exception';

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
    try {
      const user = this.userRepository.create({
        first_name: userDto.firstName,
        last_name: userDto.lastName,
        user_name: userDto.userName,
        email: userDto.email,
        password: userDto.password,
        role: { id: userDto.role },
      });
      return this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new ValidationException(error);
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async findOne(condition): Promise<User | null> {
    return this.userRepository.findOne({ where: condition });
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(updateUserDto.id, {
      ...updateUserDto,
      role: { id: updateUserDto.role },
    });
  }

  async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  async getUserWithRole(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true,
      },
    });
    return { ...user, role: user?.role?.name };
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }
}
