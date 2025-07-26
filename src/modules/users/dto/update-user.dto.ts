import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';
export class UpdateUserDto extends PickType(CreateUserDto, ['bio', 'avatar']) {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userName: string;

  @IsOptional()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
