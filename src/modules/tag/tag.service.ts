import { TAG_REPOSITORY } from '@/constants/repositories';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

export class TagService {
  constructor(
    @Inject(TAG_REPOSITORY)
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getTags() {
    try {
      return await this.tagRepository.find({
        select: ['name'],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createTags(
    createTagDto: CreateTagDto[],
  ): Promise<number[] | undefined> {
    try {
      await this.tagRepository
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values(createTagDto)
        .orIgnore()
        .execute();

      const insertedTags = await this.tagRepository.find({
        where: createTagDto,
        select: ['id'],
      });

      return insertedTags.map(tag => tag.id);
    } catch (error) {
      console.log(error);
    }
  }
}
