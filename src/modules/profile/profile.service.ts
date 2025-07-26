import { USER_REPOSITORY } from '@/constants/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(USER_REPOSITORY)
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(user_name: string) {
    try {
      const userProfile = await this.userRepository.findOne({
        where: { user_name },
      });

      if (!userProfile) {
        throw new NotFoundException('User not found');
      }

      return userProfile;
    } catch (error) {
      console.log(error);
    }
  }
}
