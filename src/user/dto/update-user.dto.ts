import { IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}
