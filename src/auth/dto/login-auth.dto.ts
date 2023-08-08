import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
