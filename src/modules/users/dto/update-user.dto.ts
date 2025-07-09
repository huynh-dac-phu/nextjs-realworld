import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
