import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  MaxLength,
} from 'class-validator';

class CommentBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  body: string;
}
export class CreateCommentBody {
  @IsNotEmptyObject()
  @IsObject()
  comment: CommentBody;
}
