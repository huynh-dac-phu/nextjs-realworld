import {
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsStrongPassword,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';

class User {
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
export class LoginDto {
  @IsNotEmptyObject()
  @IsObject()
  user: User;
}
