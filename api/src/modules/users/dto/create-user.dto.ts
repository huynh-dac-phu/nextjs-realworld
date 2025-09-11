import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @Type(() => String)
  @MaxLength(255)
  bio: string = '';

  @IsOptional()
  @Type(() => String)
  @MaxLength(255)
  avatar: string = '';

  @IsNotEmpty()
  @Type(() => Number)
  role: number = 2;

  @IsOptional()
  @Type(() => String)
  @MaxLength(255)
  accessToken: string = '';

  @IsOptional()
  @Type(() => String)
  @MaxLength(255)
  refreshToken: string = '';
}
