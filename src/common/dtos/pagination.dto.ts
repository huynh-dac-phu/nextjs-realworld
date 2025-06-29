import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderByDto {
  @IsString()
  field: string;

  @IsString()
  direction: 'ASC' | 'DESC';
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @IsString()
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderByDto)
  order_by?: OrderByDto = {
    field: 'created_at',
    direction: 'DESC',
  };
}
