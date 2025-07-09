import {
  PaginationResponse,
  PaginationMeta,
} from '@/interfaces/pagination.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginationDto } from './pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T extends Record<string, any>>(
    repository: Repository<T>,
    options: PaginationDto,
  ): Promise<PaginationResponse<T>> {
    const { page, limit, orderBy, orderDirection } = options;
    const [data, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: orderBy
        ? ({ [orderBy]: orderDirection || 'ASC' } as any)
        : undefined,
      relations: options.relations,
      where: options.where,
    });
    console.log(data);
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      total,
      page: +page,
      totalPages,
      limit: +limit,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    };
    return { data, pagination: meta };
  }
}
