import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the user',
  })
  userName: string;

  @ApiProperty({
    example: 'first name',
    description: 'First name of the user',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'last name',
    description: 'Last name of the user',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
