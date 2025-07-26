import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
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
      throw new ValidationException(error);
    }
  }

  async create(userDto: CreateUserDto) {
    const isExistEmail = await this.findByEmail(userDto.email);
    if (isExistEmail) throw 'Email is existed';

    const user = this.userRepository.create({
      first_name: userDto.firstName,
      last_name: userDto.lastName,
      user_name: userDto.userName,
      email: userDto.email,
      password: userDto.password,
      role: { id: userDto.role },
    });

    const userCreated = await this.userRepository.save(user);

    return {
      email: userCreated?.email,
      username: userCreated?.user_name,
      bio: userCreated?.bio,
      image: userCreated?.avatar,
    };
  }

  async createForAuth(userDto: CreateUserDto) {
    const user = this.userRepository.create({
      first_name: userDto.firstName,
      last_name: userDto.lastName,
      user_name: userDto.userName,
      email: userDto.email,
      password: userDto.password,
      role: { id: userDto.role },
    });

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(condition: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: condition });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser(
    id: string | number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new ResourceNotFoundException('User', id);
    }

    const updatedUserData = {
      ...updateUserDto,
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
