import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4, { message: 'min length for username is 4' })
  @MaxLength(60, { message: 'max length for username is 60' })
  username: string;

  @MinLength(5, { message: 'min length for password is 4' })
  password: string;
}
