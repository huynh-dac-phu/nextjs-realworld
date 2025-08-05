import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  article_id: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  body: string;
}
