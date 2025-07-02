import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsString()
  @IsOptional()
  orderBy: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o): boolean => Boolean(o?.orderBy))
  @IsNotEmpty()
  @IsString()
  orderDirection: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relations: string[];

  @IsString()
  @IsOptional()
  where: Record<string, any>;
}
