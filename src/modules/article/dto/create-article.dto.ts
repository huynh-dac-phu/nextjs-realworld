import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  body: string;
  // tagList?: string[];
}
