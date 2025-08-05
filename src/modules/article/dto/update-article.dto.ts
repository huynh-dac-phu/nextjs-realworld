import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  body?: string;

  @IsOptional()
  tagList?: string[];
}
