import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/constants/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationResponse } from '@/interfaces/pagination.interface';
import { PaginationService } from '@/modules/pagination/pagination.service';
import { PaginationDto } from '@/modules/pagination/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ResourceNotFoundException,
  ValidationException,
} from '@/common/exceptions/error.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(params: PaginationDto): Promise<PaginationResponse<User>> {
    try {
      return this.paginationService.paginate<User>(this.userRepository, params);
    } catch (error) {
      console.log(error);
      throw new ValidationException(error);
    }
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

  async findOne(condition): Promise<User> {
    const user = await this.userRepository.findOne({ where: condition });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
    });

    if (!user) {
      throw new ResourceNotFoundException('User', updateUserDto.id);
    }

    const updatedUserData = {
      ...updateUserDto,
      role: user.role,
    };

    this.userRepository.merge(user, updatedUserData);
    return this.userRepository.save(user);
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user || user.delete_at) {
      throw new ResourceNotFoundException('User', id);
    }
    return await this.userRepository.softDelete(id);
  }

  async getUserWithRole(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true,
      },
    });
    return user;
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }
}
